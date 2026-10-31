/**
 * Plagiarism tests.
 * Copyright © 1993-2026 Abhishek Choudhary. All rights reserved.
 * AyeAI®, AyeAM® and AyeCNSe® are registered trademarks of Abhishek Choudhary.
 */
import { checkText, checkCode, localIndex, setSearchBackend, setCodeBackend } from "./plagiarism.mjs";
function assert(c, m) { if (!c) throw new Error("FAIL: " + m); }

assert((await checkText("")).outcome === "HOLD", "Empty text holds");
assert((await checkText("short")).outcome === "OK", "Short text passes without a backend");
assert((await checkText("the quick brown fox jumps over the lazy dog near the river")).outcome === "SKIP", "No backend skips");

setSearchBackend(async (phrases) => phrases.map(p => ({ phrase: p, found: true })));
const held = await checkText("the quick brown fox jumps over the lazy dog near the river bank today");
assert(held.outcome === "HOLD", "A matching backend holds");

setCodeBackend(async () => ({ similarity: 0.9 }));
assert((await checkCode("function add(a, b) { return a + b; }")).outcome === "HOLD", "High structural similarity holds");

setCodeBackend(async () => ({ similarity: 0.1 }));
assert((await checkCode("function add(a, b) { return a + b; }")).outcome === "OK", "Low structural similarity passes");

assert(localIndex("the quick brown fox", [{ id: "e1", text: "the quick brown fox jumps" }]).outcome === "HOLD", "Local overlap holds");
assert(localIndex("completely different words here now", [{ id: "e1", text: "the quick brown fox" }]).outcome === "OK", "Local low overlap passes");

console.log("PLAGIARISM PASS");
