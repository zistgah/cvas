/** Copyright © 1993-2026 Abhishek Choudhary. All rights reserved. AyeAI®, AyeAM® and AyeCNSe® are registered trademarks of Abhishek Choudhary. */
export function run(input) {
  if (input === null || typeof input !== "object" || !Number.isFinite(input.value)) {
    return { outcome: "HOLD", reason: "value must be a finite number" };
  }
  return { outcome: "OK", value: input.value * 2 };
}
