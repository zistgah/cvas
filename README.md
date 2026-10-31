# CVAS Cloud Source Harness - Iteration 2

DOI: [10.5281/zenodo.23837986](https://doi.org/10.5281/zenodo.23837986)

Copyright © 1993-2026 Abhishek Choudhary. All rights reserved. AyeAI®, AyeAM® and AyeCNSe® are registered trademarks of Abhishek Choudhary.

**Independent seed and mint.** CVAS is a reusable contribution, verification and assurance harness for projects that expose bounded components through explicit contracts. This is **CVAS Iteration 2**, not part of the PAP iteration sequence. It is a separate lineage from the Seed and Mint Iteration 51 workstream.

## GitHub Pages site

The static, responsive project site is in `docs/` and is published by `.github/workflows/pages.yml`:

- `docs/index.html` - project overview and contribution model.
- `docs/architecture.html` - contract, composition, trust boundaries and lifecycle.
- `docs/assurance.html` - 110% testing policy and A/B/C risk classes.
- `docs/contribute.html` - human and AI contribution instructions.
- `docs/colab.html` - browser-only Colab workflow.
- `docs/contract.html` - readable contribution contract.
- `docs/license.html` - copyright, trademark and licence summary.

After pushing to the repository's `main` branch, enable GitHub Pages with **GitHub Actions** as the source if it is not already enabled. Replace `OWNER/REPOSITORY` in site links and the notebook launcher with the minted repository coordinates.

## Purpose

A contributor may be a human or an AI agent. The contributor supplies a bounded component; the harness checks the artifact. Identity and reputation do not substitute for verification.

- Low-friction contribution through a fork and browser-only Google Colab workflow.
- Project-specific contracts and policy profiles, not PAP-specific hard-coding.
- Strict manifest and archive validation.
- Executable tests, bounded timeouts, static checks and reproducible reports.
- Explicit risk classes A/B/C and mandatory human-review routing for critical changes.
- Replaceability, dependency declaration, withdrawal and impact-analysis requirements.
- CI on contributor forks and upstream pull requests; release authority remains upstream-controlled.

## Quick start

### Google Colab

Open `notebooks/cvas-cloud-harness.ipynb` in Colab after publishing the repository. The notebook can also be uploaded directly to Colab. It asks for the harness ZIP and a component ZIP, validates archive paths and limits, runs the verifier, displays the report and offers the JSON report for download.

[Open in Google Colab](https://colab.research.google.com/github/zistgah/cvas/blob/main/notebooks/cvas-cloud-harness.ipynb)

Replace `OWNER/REPOSITORY` and `main` if needed after minting the repository. The notebook is designed for browser-only participation. No desktop IDE is required.

### Local or CI

Requires Python 3.10+; Node.js 20+ only for JavaScript components.

```bash
python pipeline/verify.py examples/sample-component --json-out verification-report.json
python -m unittest discover -s tests -v
```

Create a component ZIP containing one root directory with `manifest.json`, implementation files, a test suite and a mutation-test script. Both the test suite and mutation test must run successfully. See `examples/sample-component/`.

## Contribution flow

1. Fork this repository. GitHub Actions runs on pushes and pull requests.
2. Copy `templates/` to a new component directory.
3. Implement the declared contract and add independent tests.
4. Run the verifier locally or in Colab.
5. Open a pull request. Upstream repeats checks against the proposed commit.
6. Class B/C changes receive impact/review routing. Class C requires two independent human approvals, including an authorised domain reviewer, before merge under the repository's branch-protection policy.
7. Only the upstream release process can qualify, sign or deploy.

A green CI result is verification feedback. It is not merge permission, certification or deployment authority.

## Important security boundary

The harness executes contributor-supplied tests and implementation code. **Never run an untrusted component in a runtime containing secrets, private credentials, personal files or privileged tokens.** Google Colab is an ephemeral convenience environment, not a hostile-code sandbox. GitHub CI uses a fresh runner with read-only repository permissions and no secrets. For genuinely hostile submissions, use a separately managed sandbox/container service with network disabled and resource limits.

## Assurance interpretation

The project's stated minimum is **110% testing rigor**. Here this is implemented as an assurance policy requiring more than nominal happy-path tests: contract checks, positive and negative cases, boundary cases, failure/HOLD behaviour, independent expected results, static checks, mutation tests, timeouts and impact-aware review. It is not a mathematical coverage percentage and is not proof of total correctness. The report explicitly records unrun checks as `SKIP`, never `PASS`.

## License

GPL-3.0-only. See `LICENSE`.


## Web-first and JavaScript-first implementation policy

Copyright © 1993-2026 Abhishek Choudhary. All rights reserved. AyeAI®, AyeAM® and AyeCNSe® are registered trademarks of Abhishek Choudhary.

CVAS is web-first. The static GitHub Pages interface uses HTML, CSS and JavaScript and requires no backend. New generic harness functionality should use JavaScript/Node.js wherever practical. The primary verifier is `node pipeline/verify.mjs`. Python support is retained for Python components and appropriate scientific workloads; `pipeline/verify.py` remains available as the Python compatibility verifier. The Colab notebook uses Python only for Colab upload APIs, safe ZIP handling and notebook orchestration, while the primary verification path invokes the JavaScript verifier.

Human contributors can complete the standard workflow in a browser using Google Colab. A desktop IDE or local shell is not required. Colab is not a hostile-code sandbox; do not mount private Drive data or expose secrets while running untrusted code.

AI agents extending CVAS MUST read `CONTRACT.md` first and preserve its normative web-first, JavaScript-first, Python-retention, browser-only contributor, 110% verification, provenance, replaceability, risk-routing and licensing requirements.
