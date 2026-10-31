/**
 * Free backends.
 * Copyright © 1993-2026 Abhishek Choudhary. All rights reserved.
 * AyeAI®, AyeAM® and AyeCNSe® are registered trademarks of Abhishek Choudhary.
 *
 * A free HTML search and a local structural check.
 * A paid backend can replace either. No key is shipped.
 */
export function htmlSearchBackend(fetchImpl = globalThis.fetch) {
  return async function search(phrases) {
    const out = [];
    for (const phrase of phrases) {
      const url = "https://html.duckduckgo.com/html/?q=" + encodeURIComponent('"' + phrase + '"');
      try {
        const res = await fetchImpl(url, { headers: { "User-Agent": "CVAS-harness/7" } });
        const html = await res.text();
        const found = !/No results found/i.test(html) && html.toLowerCase().includes(phrase.split(" ")[0]);
        out.push({ phrase, found });
      } catch {
        out.push({ phrase, found: false, error: "Search unreachable" });
      }
    }
    return out;
  };
}

export function localCodeBackend() {
  return async function check(code) {
    const tokens = String(code).replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*/g, "").split(/\W+/).filter(w => w.length > 1);
    const unique = new Set(tokens);
    return { similarity: unique.size ? 1 - unique.size / tokens.length : 0, note: "Local token density. Not a structural comparison." };
  };
}
