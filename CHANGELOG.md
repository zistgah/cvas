# Changelog

Copyright © 1993-2026 Abhishek Choudhary. All rights reserved. AyeAI®, AyeAM® and AyeCNSe® are registered trademarks of Abhishek Choudhary.

## Alpha 0.1.0 - iteration 8 seeded and minted

- The staging test imports the local-index check under its iteration 8 name, and a non-list index is refused again, as that test asserts.
- The pull-request policy check no longer finds its own text; it still holds a workflow that uses pull_request_target.
- CI also runs the staging, plagiarism and global-check tests.
- Site and README links point at the published repository.
- Added CITATION.cff, misty.json and ops/verify.sh, the repository's gate.
- Every change is listed in origin/SEED-DIFF.md, with each original kept under origin/.


Copyright © 1993-2026 Abhishek Choudhary. All rights reserved. AyeAI®, AyeAM® and AyeCNSe® are registered trademarks of Abhishek Choudhary.

## Iteration 8 - free plagiarism with abstraction

- A free text check fingerprints phrases and evaluates a search backend.
- A free code check evaluates a structural backend.
- Both backends are pluggable. A paid backend can be injected. No key is shipped.
- The local index remains. It does not require a network.
- A high overlap holds. It does not accuse.

# Changelog

Copyright © 1993-2026 Abhishek Choudhary. All rights reserved. AyeAI®, AyeAM® and AyeCNSe® are registered trademarks of Abhishek Choudhary.

## Iteration 7 - global check

- A global check extracts distinctive phrases and evaluates search results.
- The search is external. The harness does not crawl.
- A match holds. It does not accuse. A human decides.

# Changelog

Copyright © 1993-2026 Abhishek Choudhary. All rights reserved. AyeAI®, AyeAM® and AyeCNSe® are registered trademarks of Abhishek Choudhary.

## Iteration 6 - generic plagiarism

- The plagiarism check is language-agnostic. It compares n-grams of any text.
- It works on a component, a document, a notebook, or a comment.
- A high overlap holds. It does not accuse. It is not a legal determination.

# Changelog

Copyright © 1993-2026 Abhishek Choudhary. All rights reserved. AyeAI®, AyeAM® and AyeCNSe® are registered trademarks of Abhishek Choudhary.

## Iteration 5 - staging

- A staging repository may auto-accept a pull request that passes the pipeline. A main repository never auto-accepts.
- A ticket is issued from an accepted issue or pull request. Identity is not verified. Honor is the rule.
- A plagiarism check compares a submission against the index. A high overlap holds. It does not accuse.
- An auto-accepted pull request is indexed. Promotion is a separate decision.
- A container note is added. Ubuntu is preferred. On Windows, use WSL.
- Collaborator details are anonymized. The name and affiliation stay in the platform citation.

# Changelog

Copyright © 1993-2026 Abhishek Choudhary. All rights reserved. AyeAI®, AyeAM® and AyeCNSe® are registered trademarks of Abhishek Choudhary.

## Iteration 4 - robustness

- The queue is bounded. A full queue holds. A duplicate id holds.
- A job has a timeout. A hung function does not block a slot forever.
- The queue can persist to a file. A corrupt file is ignored.
- The independent-reference check passes when reference.json is present. Otherwise it skips. A skip is not a pass.
- A sandbox note is added. The verifier does not provide a kernel sandbox.

# Changelog

Copyright © 1993-2026 Abhishek Choudhary. All rights reserved. AyeAI®, AyeAM® and AyeCNSe® are registered trademarks of Abhishek Choudhary.

## Iteration 3 - web-first, PWA, scale

- Added a PWA manifest and a service worker. The site installs. Verification is not cached.
- Added a contribution queue. A million collaborators do not spawn a million processes. Concurrency is bounded.
- The verifier outcome INCOMPLETE is a valid result. A SKIP is not a PASS. The exit code is 2 for INCOMPLETE, 1 for FAIL, 0 for PASS.
- Carried the contract.

# Changelog

Copyright © 1993-2026 Abhishek Choudhary. All rights reserved. AyeAI®, AyeAM® and AyeCNSe® are registered trademarks of Abhishek Choudhary.

## Iteration 2 - CVAS Cloud Source Harness (independent seed and mint)

- Corrected the lineage: this is CVAS Iteration 2, independent of PAP iteration numbering and separate from Seed and Mint Iteration 51.
- Rebuilt the GitHub Pages experience as a responsive static site with overview, architecture, assurance, contribution and Colab pages.
- Added a GitHub Pages deployment workflow using GitHub Actions.
- Corrected malformed CI workflow YAML that had a literal escaped newline in a step declaration.
- Removed generated Python cache files and a stale report containing an absolute runtime path.
- Corrected iteration metadata in the verifier, notebook and documentation.
- Tightened Colab ZIP handling for Windows-style traversal paths, symlinks, encrypted entries and oversized individual files.
- Preserved the project-independent contract, A/B/C risk routing, 110% policy, evidence and replaceability principles.


## Iteration 2 - web-first / JavaScript-first correction

Copyright © 1993-2026 Abhishek Choudhary. All rights reserved. AyeAI®, AyeAM® and AyeCNSe® are registered trademarks of Abhishek Choudhary.

- Added a native Node.js verifier (`pipeline/verify.mjs`) as the primary verification implementation.
- Retained the Python verifier and Python component runtime for compatibility and scientific workloads.
- Changed the default component template and sample to Node.js.
- Changed GitHub Actions and the Colab notebook to invoke the JavaScript verifier.
- Clarified that Python in Colab is limited to Colab APIs, safe archive handling and orchestration in the standard workflow.
- Added normative AI-agent instructions to `CONTRACT.md` and `docs/WEB-FIRST.md`.
- Clarified GPL-3.0-only scope, copyright attribution and that trademark rights are not granted by the software licence.
