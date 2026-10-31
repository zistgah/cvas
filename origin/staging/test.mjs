/**
 * Staging tests.
 * Copyright © 1993-2026 Abhishek Choudhary. All rights reserved.
 * AyeAI®, AyeAM® and AyeCNSe® are registered trademarks of Abhishek Choudhary.
 */
import { issueTicket } from "./ticket.mjs";
import { checkOverlap } from "./plagiarism.mjs";
import { createIndex } from "./index.mjs";
import { acceptPolicy } from "./policy.mjs";

function assert(c, m) { if (!c) throw new Error("FAIL: " + m); }

assert(checkOverlap("", []).outcome === "HOLD", "Empty submission holds");
assert(checkOverlap("hello", "not-a-list").outcome === "HOLD", "Bad index holds");
assert(checkOverlap("the quick brown", []).outcome === "OK", "Empty index passes");
assert(checkOverlap("the quick brown fox jumps over", [{ id: "e1", text: "the quick brown fox jumps over the lazy" }]).outcome === "HOLD", "High n-gram overlap holds");
assert(checkOverlap("a completely different sentence here", [{ id: "e1", text: "the quick brown fox jumps" }]).outcome === "OK", "Low overlap passes");
assert(checkOverlap("short", [{ id: "e1", text: "also short" }]).outcome === "OK", "Too short to compare passes");

assert(issueTicket({}).outcome === "HOLD", "Ticket holds without a source");
assert(acceptPolicy({ kind: "main" }, { pipeline: "PASS" }).outcome === "HOLD", "Main does not auto-accept");
assert(acceptPolicy({ kind: "staging" }, { pipeline: "PASS" }).outcome === "OK", "Staging auto-accepts a pass");

console.log("STAGING PASS");
