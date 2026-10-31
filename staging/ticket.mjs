/**
 * Honor ticket.
 * Copyright © 1993-2026 Abhishek Choudhary. All rights reserved.
 * AyeAI®, AyeAM® and AyeCNSe® are registered trademarks of Abhishek Choudhary.
 *
 * A collaborator gets a ticket from an accepted issue or pull request.
 * The system does not verify identity. Honor is the rule.
 */
export function issueTicket({ source, id, handle }) {
  if (!source || !["issue", "pr"].includes(source)) return { outcome: "HOLD", reason: "Source must be issue or pr" };
  if (!id) return { outcome: "HOLD", reason: "Id is UNSPECIFIED" };
  if (!handle) return { outcome: "HOLD", reason: "Handle is UNSPECIFIED" };
  return { outcome: "OK", ticket: `${source}-${id}`, handle, honor: true, note: "Identity is not verified. Honor is the rule." };
}
