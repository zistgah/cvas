/**
 * Contribution queue.
 * Copyright © 1993-2026 Abhishek Choudhary. All rights reserved.
 * AyeAI®, AyeAM® and AyeCNSe® are registered trademarks of Abhishek Choudhary.
 *
 * Bounded. Timed. Persistent. Idempotent.
 * A million collaborators do not grow the queue without a limit.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";

export function createQueue({ concurrency = 4, maxPending = 1000, timeoutMs = 120000, persistPath = null } = {}) {
  const pending = [];
  const seen = new Set();
  const results = [];
  let running = 0;
  let accepted = 0;

  function save() {
    if (!persistPath) return;
    writeFileSync(persistPath, JSON.stringify({ pending: pending.map(j => j.id), results }, null, 2));
  }
  function load() {
    if (!persistPath || !existsSync(persistPath)) return;
    try {
      const data = JSON.parse(readFileSync(persistPath, "utf8"));
      for (const r of data.results || []) { results.push(r); seen.add(r.id); }
    } catch { /* corrupt file is ignored, not trusted */ }
  }
  load();

  function drain() {
    while (running < concurrency && pending.length) {
      const job = pending.shift();
      running++;
      const timer = setTimeout(() => { job.timedOut = true; }, timeoutMs);
      Promise.resolve(job.fn()).then(
        r => { if (job.timedOut) results.push({ id: job.id, outcome: "HOLD", reason: "Timed out" }); else results.push({ id: job.id, outcome: "OK", result: r }); },
        e => { results.push({ id: job.id, outcome: "HOLD", reason: String(e.message || e) }); }
      ).finally(() => { clearTimeout(timer); running--; save(); drain(); });
    }
  }

  return {
    submit(id, fn) {
      if (seen.has(id)) return { outcome: "HOLD", reason: "Already submitted", id };
      if (accepted >= maxPending) return { outcome: "HOLD", reason: "Queue is full", id };
      seen.add(id);
      accepted++;
      pending.push({ id, fn });
      save();
      drain();
      return { outcome: "QUEUED", id, position: pending.length };
    },
    size() { return pending.length + running; },
    results() { return results.slice(); },
    bound() { return maxPending; }
  };
}
