/**
 * Staging index.
 * Copyright © 1993-2026 Abhishek Choudhary. All rights reserved.
 * AyeAI®, AyeAM® and AyeCNSe® are registered trademarks of Abhishek Choudhary.
 *
 * An auto-accepted pull request is indexed. It is not promoted.
 * Promotion is a separate decision based on fitment and hardening.
 */
export function createIndex() {
  const entries = [];
  return {
    add(entry) {
      if (!entry || !entry.id || !entry.text) return { outcome: "HOLD", reason: "Id and text are required" };
      entries.push({ ...entry, indexed: new Date().toISOString(), promoted: false });
      return { outcome: "OK", id: entry.id };
    },
    list() { return entries.slice(); },
    promote(id) {
      const e = entries.find(x => x.id === id);
      if (!e) return { outcome: "HOLD", reason: "Not in the index" };
      e.promoted = true;
      return { outcome: "OK", id };
    }
  };
}
