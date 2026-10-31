/**
 * Global check tests.
 * Copyright © 1993-2026 Abhishek Choudhary. All rights reserved.
 * AyeAI®, AyeAM® and AyeCNSe® are registered trademarks of Abhishek Choudhary.
 */
import { distinctivePhrases, evaluateResults } from "./global-check.mjs";
function assert(c, m) { if (!c) throw new Error("FAIL: " + m); }

const phrases = distinctivePhrases("the quick brown fox jumps over the lazy dog near the river bank");
assert(phrases.length > 0, "Phrases are extracted");
assert(evaluateResults([], []).outcome === "HOLD", "No phrases holds");
assert(evaluateResults(phrases, []).outcome === "OK", "No results passes");
assert(evaluateResults(phrases, [{ url: "https://example.test/x", snippet: "the quick brown fox jumps over the lazy" }]).outcome === "HOLD", "A matching result holds");
assert(evaluateResults(phrases, [{ url: "https://example.test/y", snippet: "unrelated content here" }]).outcome === "OK", "An unrelated result passes");
console.log("GLOBAL PASS");
