/** Copyright © 1993-2026 Abhishek Choudhary. All rights reserved. AyeAI®, AyeAM® and AyeCNSe® are registered trademarks of Abhishek Choudhary. */
import { run } from "./component.js";
import assert from "node:assert/strict";

const valid = { value: 7 };
const before = structuredClone(valid);
assert.deepEqual(run(valid), { outcome: "OK", value: 14 });
assert.deepEqual(valid, before, "input must not be mutated");
assert.deepEqual(run({value:0}), {outcome:"OK",value:0});
assert.deepEqual(run({value:-3}), {outcome:"OK",value:-6});
for (const invalid of [undefined, null, {}, {value:null}, {value:"2"}, {value:NaN}, {value:Infinity}, 3]) {
  assert.equal(run(invalid).outcome, "HOLD", "invalid input must HOLD");
}
console.log("PASS: 12 contract assertions");
