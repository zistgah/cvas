/**
 * Global plagiarism check.
 * Copyright © 1993-2026 Abhishek Choudhary. All rights reserved.
 * AyeAI®, AyeAM® and AyeCNSe® are registered trademarks of Abhishek Choudhary.
 *
 * Extracts distinctive phrases and evaluates search results.
 * The search itself is external. The harness does not crawl.
 * A match holds. It does not accuse. A human decides.
 */
export function distinctivePhrases(text, { n = 5, limit = 5 } = {}) {
  const tokens = String(text || "").toLowerCase().split(/\s+/).filter(Boolean);
  const phrases = [];
  for (let i = 0; i <= tokens.length - n && phrases.length < limit; i++) {
    phrases.push(tokens.slice(i, i + n).join(" "));
  }
  return phrases;
}

export function evaluateResults(phrases, results) {
  if (!phrases || !phrases.length) return { outcome: "HOLD", reason: "No distinctive phrases" };
  if (!Array.isArray(results)) return { outcome: "HOLD", reason: "Results must be a list" };
  const hits = [];
  for (const phrase of phrases) {
    for (const r of results) {
      const hay = ((r.title || "") + " " + (r.snippet || "") + " " + (r.url || "")).toLowerCase();
      if (hay.includes(phrase)) hits.push({ phrase, url: r.url || null });
    }
  }
  if (hits.length) return { outcome: "HOLD", hits, note: "A public source contains a distinctive phrase. A human decides. This is not a legal determination." };
  return { outcome: "OK", hits: [], note: "No distinctive phrase found in the supplied results." };
}
