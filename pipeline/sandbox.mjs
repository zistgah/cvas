/**
 * Sandbox note.
 * Copyright © 1993-2026 Abhishek Choudhary. All rights reserved.
 * AyeAI®, AyeAM® and AyeCNSe® are registered trademarks of Abhishek Choudhary.
 *
 * The verifier restricts the environment. It does not provide a kernel sandbox.
 * A component runs as the same user. Do not run an untrusted component on a machine that holds secrets.
 * For a stronger boundary, run the verifier inside a container or a separate user.
 */
export function restrictedEnv() {
  return { PATH: process.env.PATH || "", HOME: "/tmp", CI: "1", PYTHONNOUSERSITE: "1" };
}
