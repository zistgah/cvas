/**
 * Plagiarism check.
 * Copyright © 1993-2026 Abhishek Choudhary. All rights reserved.
 * AyeAI®, AyeAM® and AyeCNSe® are registered trademarks of Abhishek Choudhary.
 *
 * Free by default. A paid backend can be injected. No key is required.
 * A high overlap holds. It does not accuse. A human decides.
 */
let searchBackend = null;
let codeBackend = null;

export function setSearchBackend(fn) { searchBackend = fn; }
export function setCodeBackend(fn) { codeBackend = fn; }

function grams(text, n = 5) {
  const tokens = String(text || "").toLowerCase().replace(/[^\w\s]/g, " ").split(/\s+/).filter(Boolean);
  const out = [];
  for (let i = 0; i <= tokens.length - n; i++) out.push(tokens.slice(i, i + n).join(" "));
  return out;
}

export async function checkText(text, { threshold = 0.45, phraseLength = 9 } = {}) {
  if (!text) return { outcome: "HOLD", reason: "Text is UNSPECIFIED" };
  const phrases = grams(text, phraseLength).slice(0, 8);
  if (!phrases.length) return { outcome: "OK", overlap: 0, note: "Too short to fingerprint" };
  if (!searchBackend) return { outcome: "SKIP", reason: "No search backend is set. Inject one or use the local index." };
  const results = await searchBackend(phrases);
  const matched = results.filter(r => r.found);
  const ratio = matched.length / phrases.length;
  if (ratio >= threshold) return { outcome: "HOLD", overlap: Number(ratio.toFixed(3)), matched: matched.map(m => m.phrase), note: "A public source contains distinctive phrases. A human decides." };
  return { outcome: "OK", overlap: Number(ratio.toFixed(3)) };
}

export async function checkCode(code, { threshold = 0.75 } = {}) {
  if (!code) return { outcome: "HOLD", reason: "Code is UNSPECIFIED" };
  if (!codeBackend) return { outcome: "SKIP", reason: "No code backend is set. Inject one or run the local index." };
  const result = await codeBackend(code);
  if (result.similarity >= threshold) return { outcome: "HOLD", similarity: result.similarity, note: "Structural similarity is high. A human decides." };
  return { outcome: "OK", similarity: result.similarity };
}

export function localIndex(submission, index, { threshold = 0.6, n = 3 } = {}) {
  if (!submission) return { outcome: "HOLD", reason: "Submission is UNSPECIFIED" };
  if (!Array.isArray(index)) return { outcome: "HOLD", reason: "Index is not a list" };
  if (!index.length) return { outcome: "OK", overlap: 0, note: "Index is empty" };
  const mine = new Set(grams(submission, n));
  if (!mine.size) return { outcome: "OK", overlap: 0, note: "Too short" };
  let max = 0, match = null;
  for (const entry of index) {
    const other = new Set(grams(entry.text || "", n));
    if (!other.size) continue;
    let common = 0;
    for (const g of mine) if (other.has(g)) common++;
    const overlap = common / Math.max(mine.size, other.size);
    if (overlap > max) { max = overlap; match = entry.id; }
  }
  if (max >= threshold) return { outcome: "HOLD", overlap: Number(max.toFixed(3)), match, note: "Local overlap is high. A human decides." };
  return { outcome: "OK", overlap: Number(max.toFixed(3)), match };
}
