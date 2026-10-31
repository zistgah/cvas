# CVAS Component Contract - Iteration 2

Copyright © 1993-2026 Abhishek Choudhary. All rights reserved. AyeAI®, AyeAM® and AyeCNSe® are registered trademarks of Abhishek Choudhary.

## Purpose and implementation priority

CVAS is a project-independent contribution, verification and assurance harness. It is **web-first and JavaScript-first**. The canonical browser-facing workflow, static site, contributor interface, automation glue and default component runtime should use HTML, CSS and JavaScript/Node.js wherever those technologies can perform the required work. Do not introduce Python merely out of habit or convenience.

Python remains a supported component runtime and compatibility adapter for workloads where Python libraries, scientific ecosystems or existing implementations make it materially appropriate. Python is not being removed, deprecated or prohibited. Use the smallest Python layer necessary for Colab-specific file upload/extraction or for executing a Python component. Do not reimplement ordinary web, UI, JSON, manifest, validation, workflow or orchestration functionality in Python when JavaScript is suitable.

## Contributor and AI-agent instructions (normative)

Any AI agent or human collaborator extending this harness MUST:

1. Preserve the project-independent nature of CVAS. Do not hard-code PAP or another adopting project's domain model into the generic harness.
2. Preserve CVAS Iteration 2 lineage. This is not a PAP iteration and is independently seeded and minted.
3. Prefer browser-native HTML/CSS/JavaScript and Node.js for new functionality. Keep the static GitHub Pages site static, responsive, accessible and usable without a backend.
4. Retain Python support. Python components must remain verifiable; do not delete or silently narrow the Python adapter.
5. Keep human contributors able to complete the ordinary workflow entirely in Google Colab through a browser. Do not require a desktop IDE, local shell, desktop office suite or local Python installation.
6. Use Colab's Python only where Colab's upload API, safe archive handling or Python component execution requires it. Use Node.js for the primary CVAS verifier and JavaScript component execution.
7. Preserve the manifest, interface contract, HOLD/fail-closed behaviour, risk classes, evidence provenance, replaceability and review routing. Do not weaken required fields or convert SKIP/INCOMPLETE into PASS.
8. Never allow a contributor-declared risk class to downgrade upstream policy. The adopting project owns authoritative risk classification and reviewer permissions.
9. Keep contributor CI unprivileged. Never expose secrets or release credentials to fork or untrusted pull-request code.
10. Update tests, notebook, static pages, contract notes, changelog and verification report together when behaviour changes.
11. Include copyright and licence notices in newly created source files and preserve existing notices. Do not remove attribution or trademark notices.
12. Report precisely what was executed, skipped and not verified. Do not claim live GitHub Pages publication, live Colab execution, hostile-code sandboxing, certification or complete assurance unless actually established.

## Contract fields

Every component manifest declares identity, purpose, runtime, entrypoint, test and mutation test; inputs/outputs; interfaces; preconditions/postconditions/invariants; state ownership; dependencies; failure behaviour; replaceability; verification obligations; risk class; licence and copyright.

## 110% verification policy

110% is the minimum rigor policy, not a literal percentage. Required test families include positive, negative, boundary, malformed-input, failure, invariant, regression, integration, adversarial and mutation tests as applicable. Passing line coverage alone is insufficient. The adopting project must supply independent reference cases and domain-specific integration tests. Missing, skipped or unauthenticated evidence produces INCOMPLETE or HOLD, never PASS.

## Risk classes

- A: replaceable, isolated, contract-bound. Full generic automated verification; project may impose more.
- B: significant dependencies or workflow impact. Full automated verification and independent technical review.
- C: critical authority, safety, canonical state, evidence integrity, release control or trusted kernel. Full automated verification, complete human examination of the change set, and two independent upstream approvals.

## Licence and ownership

The harness is distributed under GNU GPL version 3 only (`GPL-3.0-only`). The full licence text is in `LICENSE`. Copyright and trademark notices identify the stated rights holder. AyeAI®, AyeAM® and AyeCNSe® are registered trademarks; the licence does not grant trademark rights. Contributions must not remove existing notices. Before accepting third-party code, the adopting project must confirm contributor authority and licence compatibility.
