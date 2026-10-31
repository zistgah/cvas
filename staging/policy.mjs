/**
 * Repository policy.
 * Copyright © 1993-2026 Abhishek Choudhary. All rights reserved.
 * AyeAI®, AyeAM® and AyeCNSe® are registered trademarks of Abhishek Choudhary.
 *
 * A staging repository may auto-accept a pull request that passes the pipeline.
 * A main repository never auto-accepts. A human promotes.
 */
export function acceptPolicy(repo, pr) {
  if (!repo || !repo.kind) return { outcome: "HOLD", reason: "Repository kind is UNSPECIFIED" };
  if (repo.kind === "main") return { outcome: "HOLD", reason: "A main repository does not auto-accept" };
  if (repo.kind === "staging" && pr && pr.pipeline === "PASS") return { outcome: "OK", action: "auto-accept", note: "Indexed. Not promoted." };
  return { outcome: "HOLD", reason: "Pipeline did not pass" };
}
