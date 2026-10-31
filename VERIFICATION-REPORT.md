# CVAS Iteration 2 - verification report

Copyright © 1993-2026 Abhishek Choudhary. All rights reserved. AyeAI®, AyeAM® and AyeCNSe® are registered trademarks of Abhishek Choudhary.

## Changes in this correction

- CVAS remains an independent project and remains at Iteration 2. No PAP iteration number is used.
- Added `pipeline/verify.mjs`, a native Node.js verifier and the primary verification path.
- Retained `pipeline/verify.py` and Python component support.
- Default template and JavaScript sample use Node.js. Added a separate Python sample to demonstrate retained Python execution.
- GitHub Actions and the Colab notebook use the JavaScript verifier by default. CI also exercises the Python adapter and Python compatibility verifier.
- Updated `CONTRACT.md` with normative instructions for Grok and other AI agents: web-first, JavaScript-first, Python retained, browser-only Colab contributor workflow, 110% verification, fail-closed semantics, evidence and replaceability.
- Added a styled Web-first policy page to the GitHub Pages site and navigation.
- Clarified GPL-3.0-only, copyright ownership and that trademarks are not licensed by the software licence.

## Executed checks

| Check | Result |
|---|---|
| Python verifier unit tests | 3/3 PASS |
| JavaScript verifier on Node sample | PASS for executable and mutation tests; overall INCOMPLETE |
| JavaScript verifier on Python sample | PASS for Python runtime, executable and mutation tests; overall INCOMPLETE |
| Python compatibility verifier on Python sample | PASS for executable and mutation tests; overall INCOMPLETE |
| JavaScript syntax check | PASS |
| Python notebook code-cell compilation | 6 code cells PASS |
| Static HTML local-reference check | 8 pages, zero broken local references |
| GitHub Actions workflow YAML parsing | 3 workflows parsed |
| Licence and contract metadata checks | PASS |

## Why sample outcomes are INCOMPLETE

The generic seed intentionally does not claim independent domain-reference attestation or adopting-project integration evidence. These are skipped obligations, so the final status is INCOMPLETE, not PASS. No failed checks were reported for the two sample components.

## Not executed / not claimed

- The notebook was syntax-checked but not run in Google's live Colab environment.
- GitHub Actions and GitHub Pages were not run against a live remote repository.
- No hostile-code sandbox, external certification or production deployment is claimed.
- The static site is ready for publication from `docs/` using the included Pages workflow, after repository owner configuration.

## Alpha 0.1.0 (iteration 8), executed when seeded

| Check | Result |
|---|---|
| Python verifier unit tests | 3/3 PASS |
| JavaScript verifier on the Node sample | INCOMPLETE by design: 27 PASS, 2 SKIP, 1 NOT_APPLICABLE |
| JavaScript verifier on the Python sample | INCOMPLETE by design, no failed check |
| Python verifier on the Python sample | INCOMPLETE by design, no failed check |
| Staging tests | PASS (failed at import before this release) |
| Plagiarism and global-check tests | PASS |
| Pull-request policy step | PASS on this repository; holds a planted pull_request_target workflow |
| Workflows and CITATION.cff | parse |
| Static site, 8 pages in Chromium | no page errors, no failed requests, no broken local links |

Not executed here: the notebook in Google's live Colab, and the workflows on GitHub before the first push.
Known limitation: the mutation-test check runs the contributor's script and passes whenever it exits 0, so an empty mutation test passes; see the brief for the fix.
