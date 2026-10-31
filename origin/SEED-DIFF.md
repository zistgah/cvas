Copyright © 1993–2026 Abhishek Choudhary. All rights reserved. AyeAI.

# Seed diff: CVAS iteration 8, alpha 0.1.0

This repository was seeded from `cvas-cloud-source-harness-iteration-8.zip`
(SHA-256 `3d14bbbefc95b61befc4b987095bd90ec838d84e331a0c91cd29db81ccee1acb`, 63 files).
Every file in that archive is present. The originals of the files changed below are kept under
`origin/` at the same relative paths.

| File | Why it changed | What changed |
|---|---|---|
| `staging/test.mjs` | Iteration 8 renamed the local-index check, so the staging test failed at import. | It imports `localIndex` under the name it used. |
| `staging/plagiarism.mjs` | Iteration 8 treated a non-list index as an empty one, while the staging test asserts that it holds. | A non-list index holds; an empty list is still accepted as empty. |
| `.github/workflows/pull-request-policy.yml` | The check searched for `pull_request_target` and found its own command, so every pull request failed it. | It skips its own file and looks for the trigger itself; a planted workflow using it is still held. |
| `.github/workflows/cvas-ci.yml` | The staging, plagiarism and global-check tests were not run by CI. | A step runs them. |
| `README.md`, `docs/*.html` (six pages) | Links carried the `OWNER/REPOSITORY` placeholder. | Links point at `zistgah/cvas`. Guidance for adopting projects is left as written. |
| `CHANGELOG.md`, `VERIFICATION-REPORT.md` | The release needed its entry and its executed checks. | An alpha entry and an executed-checks section. |

Added: `CITATION.cff`, `misty.json`, `ops/verify.sh` (the repository's gate), and `origin/`.

## Unified diff

```diff
--- origin/README.md
+++ README.md
@@ -36,7 +36,7 @@
 
 Open `notebooks/cvas-cloud-harness.ipynb` in Colab after publishing the repository. The notebook can also be uploaded directly to Colab. It asks for the harness ZIP and a component ZIP, validates archive paths and limits, runs the verifier, displays the report and offers the JSON report for download.
 
-[Open in Google Colab](https://colab.research.google.com/github/OWNER/REPOSITORY/blob/main/notebooks/cvas-cloud-harness.ipynb)
+[Open in Google Colab](https://colab.research.google.com/github/zistgah/cvas/blob/main/notebooks/cvas-cloud-harness.ipynb)
 
 Replace `OWNER/REPOSITORY` and `main` if needed after minting the repository. The notebook is designed for browser-only participation. No desktop IDE is required.
 
--- origin/docs/architecture.html
+++ docs/architecture.html
@@ -1,5 +1,5 @@
 <!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="CVAS architecture: contracts, verification, assurance, lifecycle and replaceability."><title>Architecture | CVAS</title><link rel="icon" href="assets/mark.svg"><link rel="stylesheet" href="assets/site.css"></head><body>
-<header class="topbar"><a class="brand" href="index.html"><img src="assets/mark.svg" width="34" alt=""><span>CVAS <small>Cloud Source Harness</small></span></a><button class="menu-toggle" aria-label="Toggle navigation" aria-expanded="false">☰</button><nav id="nav"><a href="index.html">Overview</a><a href="assurance.html">Assurance</a><a href="contribute.html">Contribute</a><a href="colab.html">Colab</a><a href="WEB-FIRST.html">Web-first</a><a class="nav-cta" href="https://github.com/OWNER/REPOSITORY">GitHub ↗</a></nav></header>
+<header class="topbar"><a class="brand" href="index.html"><img src="assets/mark.svg" width="34" alt=""><span>CVAS <small>Cloud Source Harness</small></span></a><button class="menu-toggle" aria-label="Toggle navigation" aria-expanded="false">☰</button><nav id="nav"><a href="index.html">Overview</a><a href="assurance.html">Assurance</a><a href="contribute.html">Contribute</a><a href="colab.html">Colab</a><a href="WEB-FIRST.html">Web-first</a><a class="nav-cta" href="https://github.com/zistgah/cvas">GitHub ↗</a></nav></header>
 <section class="subhero"><div class="wrap"><div class="eyebrow">ARCHITECTURE · ITERATION 2</div><h1>A portable assurance<br><em>spine for contributions.</em></h1><p>CVAS standardises how a project receives, verifies, reviews and retires independently produced components. It does not replace the adopting project's domain architecture.</p></div></section>
 <main class="wrap content"><h2>Five cooperating surfaces</h2><div class="link-grid"><div class="link-card"><b>01 · Contribution surface</b><span>Forks, task briefs, templates, AI assistance, Colab and pull requests.</span></div><div class="link-card"><b>02 · Contract surface</b><span>Manifest, types, interfaces, preconditions, postconditions, invariants and failure semantics.</span></div><div class="link-card"><b>03 · Verification surface</b><span>Structural checks, execution, reference cases, mutation, compatibility and regression.</span></div><div class="link-card"><b>04 · Assurance surface</b><span>Risk classification, reviewer routing, evidence provenance and promotion status.</span></div><div class="link-card"><b>05 · Lifecycle surface</b><span>Substitution, deprecation, withdrawal, rollback and retained history.</span></div></div>
 <h2>Component contract</h2><p>Every component must declare identity, version, purpose, runtime, entrypoint, tests, typed inputs and outputs, interfaces, preconditions, postconditions, invariants, state ownership, dependencies, failure behaviour, replaceability, verification obligations, risk class, licence and copyright.</p><div class="info-box"><b>Project authority remains local.</b> The adopting project supplies canonical requirement IDs, domain schemas, interface versions, independent reference vectors, reviewer roles and release authority. CVAS must not silently invent or override these.</div>
--- origin/docs/assurance.html
+++ docs/assurance.html
@@ -1,5 +1,5 @@
 <!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="CVAS 110% testing policy and risk-based assurance classes."><title>Assurance | CVAS</title><link rel="icon" href="assets/mark.svg"><link rel="stylesheet" href="assets/site.css"></head><body>
-<header class="topbar"><a class="brand" href="index.html"><img src="assets/mark.svg" width="34" alt=""><span>CVAS <small>Cloud Source Harness</small></span></a><button class="menu-toggle" aria-label="Toggle navigation" aria-expanded="false">☰</button><nav id="nav"><a href="index.html">Overview</a><a href="architecture.html">Architecture</a><a href="contribute.html">Contribute</a><a href="colab.html">Colab</a><a href="WEB-FIRST.html">Web-first</a><a class="nav-cta" href="https://github.com/OWNER/REPOSITORY">GitHub ↗</a></nav></header>
+<header class="topbar"><a class="brand" href="index.html"><img src="assets/mark.svg" width="34" alt=""><span>CVAS <small>Cloud Source Harness</small></span></a><button class="menu-toggle" aria-label="Toggle navigation" aria-expanded="false">☰</button><nav id="nav"><a href="index.html">Overview</a><a href="architecture.html">Architecture</a><a href="contribute.html">Contribute</a><a href="colab.html">Colab</a><a href="WEB-FIRST.html">Web-first</a><a class="nav-cta" href="https://github.com/zistgah/cvas">GitHub ↗</a></nav></header>
 <section class="subhero"><div class="wrap"><div class="eyebrow">VERIFICATION POLICY</div><h1>110% means test<br><em>beyond the happy path.</em></h1><p>The minimum is an assurance discipline, not a coverage statistic. Every project adds domain-specific verification to the generic harness.</p></div></section>
 <main class="wrap content"><h2>Mandatory verification families</h2><ul><li>Manifest and contract schema validation.</li><li>Positive, negative, missing, malformed and boundary inputs.</li><li>Preconditions, postconditions, invariants and state ownership.</li><li>Independent expected results and reference vectors.</li><li>Failure, HOLD, timeout, partial-result and recovery behaviour.</li><li>Mutation testing to demonstrate that tests detect incorrect implementations.</li><li>Dependency, compatibility and downstream impact analysis.</li><li>Regression, adversarial and resource-boundary tests appropriate to risk.</li><li>Reproducibility, source hashes, runtime details and explicit skipped-check reporting.</li></ul>
 <h2>Risk classes</h2><div class="table-wrap"><table><thead><tr><th>Class</th><th>Definition</th><th>Required assurance</th></tr></thead><tbody><tr><td><b>A · Replaceable</b></td><td>Isolated, bounded effects, no privileged authority.</td><td>Generic 110% automated checks plus project-specific checks.</td></tr><tr><td><b>B · Significant</b></td><td>Important workflows, broad dependants or consequential data.</td><td>Class A plus dependency impact and independent technical review.</td></tr><tr><td><b>C · Critical</b></td><td>Trust kernel, safety, authority, evidence integrity, canonical state or release control.</td><td>Class B plus complete human examination of the change set and two independent approvals, including a domain-authorised reviewer.</td></tr></tbody></table></div>
--- origin/docs/colab.html
+++ docs/colab.html
@@ -1,6 +1,6 @@
 <!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="Browser-only CVAS contribution verification using Google Colab."><title>Colab | CVAS</title><link rel="icon" href="assets/mark.svg"><link rel="stylesheet" href="assets/site.css"></head><body>
-<header class="topbar"><a class="brand" href="index.html"><img src="assets/mark.svg" width="34" alt=""><span>CVAS <small>Cloud Source Harness</small></span></a><button class="menu-toggle" aria-label="Toggle navigation" aria-expanded="false">☰</button><nav id="nav"><a href="index.html">Overview</a><a href="architecture.html">Architecture</a><a href="assurance.html">Assurance</a><a href="contribute.html">Contribute</a><a class="nav-cta" href="https://github.com/OWNER/REPOSITORY">GitHub ↗</a></nav></header>
-<section class="subhero"><div class="wrap"><div class="eyebrow">BROWSER-ONLY WORKBENCH</div><h1>Build and verify from<br><em>Google Colab.</em></h1><p>Human collaborators can use a browser-only path. No local IDE, terminal or desktop office suite is required for the standard notebook workflow.</p><p><a class="button primary" href="https://colab.research.google.com/github/OWNER/REPOSITORY/blob/main/notebooks/cvas-cloud-harness.ipynb">Open CVAS notebook in Colab ↗</a></p></div></section>
+<header class="topbar"><a class="brand" href="index.html"><img src="assets/mark.svg" width="34" alt=""><span>CVAS <small>Cloud Source Harness</small></span></a><button class="menu-toggle" aria-label="Toggle navigation" aria-expanded="false">☰</button><nav id="nav"><a href="index.html">Overview</a><a href="architecture.html">Architecture</a><a href="assurance.html">Assurance</a><a href="contribute.html">Contribute</a><a class="nav-cta" href="https://github.com/zistgah/cvas">GitHub ↗</a></nav></header>
+<section class="subhero"><div class="wrap"><div class="eyebrow">BROWSER-ONLY WORKBENCH</div><h1>Build and verify from<br><em>Google Colab.</em></h1><p>Human collaborators can use a browser-only path. No local IDE, terminal or desktop office suite is required for the standard notebook workflow.</p><p><a class="button primary" href="https://colab.research.google.com/github/zistgah/cvas/blob/main/notebooks/cvas-cloud-harness.ipynb">Open CVAS notebook in Colab ↗</a></p></div></section>
 <main class="wrap content"><h2>How the notebook works</h2><ol><li>Open the notebook from the repository in Google Colab.</li><li>Upload the CVAS harness ZIP for this iteration.</li><li>Upload one component ZIP containing its manifest, implementation and tests.</li><li>The notebook checks archive paths and limits before extraction.</li><li>The JavaScript-first verifier runs in the temporary Colab runtime. Python is used for Colab upload/download and safe archive handling; Python component support remains available.</li><li>Inspect the check-by-check outcome and download the JSON evidence report.</li></ol>
 <h2>Implementation policy</h2><p>CVAS is web-first and JavaScript-first. The primary verifier is Node.js. Python remains supported for Python components and scientific workloads. The notebook uses Python only for Colab-specific upload/download, archive handling and orchestration.</p><h2>What you need</h2><ul><li>A Google account with access to Colab.</li><li>A browser and network connection.</li><li>The published CVAS harness ZIP and a component ZIP.</li><li>No desktop IDE or local development environment.</li></ul>
 <div class="info-box"><b>Security warning:</b> the notebook executes contributor-supplied code. Do not mount Google Drive, upload private files, enter credentials or use a runtime with secrets. Colab is an ephemeral convenience environment, not an isolated hostile-code sandbox. For untrusted hostile submissions, use a controlled runner with network disabled, resource limits and disposable isolation.</div>
--- origin/docs/contribute.html
+++ docs/contribute.html
@@ -1,5 +1,5 @@
 <!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="How humans and AI agents contribute components through CVAS."><title>Contribute | CVAS</title><link rel="icon" href="assets/mark.svg"><link rel="stylesheet" href="assets/site.css"></head><body>
-<header class="topbar"><a class="brand" href="index.html"><img src="assets/mark.svg" width="34" alt=""><span>CVAS <small>Cloud Source Harness</small></span></a><button class="menu-toggle" aria-label="Toggle navigation" aria-expanded="false">☰</button><nav id="nav"><a href="index.html">Overview</a><a href="architecture.html">Architecture</a><a href="assurance.html">Assurance</a><a href="colab.html">Colab</a><a href="WEB-FIRST.html">Web-first</a><a class="nav-cta" href="https://github.com/OWNER/REPOSITORY">GitHub ↗</a></nav></header>
+<header class="topbar"><a class="brand" href="index.html"><img src="assets/mark.svg" width="34" alt=""><span>CVAS <small>Cloud Source Harness</small></span></a><button class="menu-toggle" aria-label="Toggle navigation" aria-expanded="false">☰</button><nav id="nav"><a href="index.html">Overview</a><a href="architecture.html">Architecture</a><a href="assurance.html">Assurance</a><a href="colab.html">Colab</a><a href="WEB-FIRST.html">Web-first</a><a class="nav-cta" href="https://github.com/zistgah/cvas">GitHub ↗</a></nav></header>
 <section class="subhero"><div class="wrap"><div class="eyebrow">HUMAN + AI CONTRIBUTION</div><h1>Contribute a component.<br><em>Let the harness do the heavy lifting.</em></h1><p>Contributors do not need to understand the whole adopting platform. They need a bounded task, a declared contract and an artifact that can be verified.</p></div></section>
 <main class="wrap content"><h2>Quick path</h2><ol><li>Fork the adopting repository. The supplied GitHub Actions workflow runs on pushes and pull requests.</li><li>Copy the starter files from <code>templates/</code> and give the component a stable ID and version.</li><li>Describe purpose, runtime, interfaces, inputs, outputs, assumptions, invariants, state ownership, dependencies and failure behaviour.</li><li>Implement the capability. AI assistance may generate code, tests, examples and documentation.</li><li>Add independent reference cases, boundary tests, negative tests and a mutation test.</li><li>Run CI in the fork or open the Colab notebook and upload the component ZIP.</li><li>Open a pull request. Upstream repeats checks and routes review according to project risk policy.</li></ol>
 <h2>What to submit</h2><ul><li><code>manifest.json</code> - machine-readable contract and risk declaration.</li><li>Implementation entrypoint - executable capability, not a placeholder status response.</li><li>Test suite - tests that call the implementation and detect incorrect behaviour.</li><li>Mutation test - evidence that the suite rejects a deliberately incorrect implementation.</li><li>Reference vectors - expected results derived independently where feasible.</li><li>Documentation - limitations, assumptions, dependencies and replacement procedure.</li></ul>
--- origin/docs/index.html
+++ docs/index.html
@@ -11,7 +11,7 @@
 <script>if("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js");</script>
 </head>
 <body>
-<header class="topbar"><a class="brand" href="index.html"><img src="assets/mark.svg" alt="" width="34" height="34"><span>CVAS <small>Cloud Source Harness</small></span></a><button class="menu-toggle" aria-label="Toggle navigation" aria-expanded="false">☰</button><nav id="nav"><a href="#architecture">Architecture</a><a href="#workflow">Workflow</a><a href="#assurance">Assurance</a><a href="contribute.html">Contribute</a><a href="colab.html">Colab</a><a href="WEB-FIRST.html">Web-first</a><a class="nav-cta" href="https://github.com/OWNER/REPOSITORY">GitHub ↗</a></nav></header>
+<header class="topbar"><a class="brand" href="index.html"><img src="assets/mark.svg" alt="" width="34" height="34"><span>CVAS <small>Cloud Source Harness</small></span></a><button class="menu-toggle" aria-label="Toggle navigation" aria-expanded="false">☰</button><nav id="nav"><a href="#architecture">Architecture</a><a href="#workflow">Workflow</a><a href="#assurance">Assurance</a><a href="contribute.html">Contribute</a><a href="colab.html">Colab</a><a href="WEB-FIRST.html">Web-first</a><a class="nav-cta" href="https://github.com/zistgah/cvas">GitHub ↗</a></nav></header>
 <main>
 <section class="hero wrap"><div class="hero-copy"><div class="eyebrow"><span class="pulse"></span> INDEPENDENT SEED & MINT · ITERATION 2</div><h1>Make contribution easy.<br><em>Make acceptance rigorous.</em></h1><p class="lede">A reusable cloud source harness for projects built around bounded components and explicit contracts. Humans and AI agents can contribute from a browser. The project spine verifies what they submit.</p><div class="actions"><a class="button primary" href="contribute.html">Explore contribution flow <span>→</span></a><a class="button secondary" href="colab.html">Open Colab workflow</a></div><div class="hero-meta"><span>Project-independent</span><span>Fork-first CI</span><span>Browser-based collaboration</span></div></div><div class="hero-visual" aria-label="Contribution pipeline illustration"><div class="orbit orbit-a"></div><div class="orbit orbit-b"></div><div class="core"><img src="assets/mark.svg" alt="CVAS mark"><b>CVAS</b><small>ASSURANCE SPINE</small></div><div class="node node-one"><b>01</b><span>Intent</span></div><div class="node node-two"><b>02</b><span>Contract</span></div><div class="node node-three"><b>03</b><span>Verify</span></div><div class="node node-four"><b>04</b><span>Evidence</span></div><div class="node node-five"><b>05</b><span>Promote</span></div></div></section>
 <section class="stats wrap"><div><strong>110%</strong><span>minimum testing-rigor policy</span></div><div><strong>A / B / C</strong><span>risk-aware assurance classes</span></div><div><strong>0</strong><span>required desktop IDEs for Colab path</span></div><div><strong>1</strong><span>portable component contract</span></div></section>
--- origin/docs/license.html
+++ docs/license.html
@@ -1 +1 @@
-<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>License & Notices | CVAS</title><link rel="icon" href="assets/mark.svg"><link rel="stylesheet" href="assets/site.css"></head><body><header class="topbar"><a class="brand" href="index.html"><img src="assets/mark.svg" width="34" alt=""><span>CVAS <small>Cloud Source Harness</small></span></a><nav><a href="index.html">Overview</a><a href="contract.html">Contract</a></nav></header><section class="subhero"><div class="wrap"><div class="eyebrow">LEGAL & ATTRIBUTION</div><h1>Copyright, marks<br><em>and licence.</em></h1><p>Project identity and licensing information for this independent seed.</p></div></section><main class="wrap content"><h2>Copyright and trademarks</h2><p>Copyright © 1993-2026 Abhishek Choudhary. All rights reserved. AyeAI®, AyeAM® and AyeCNSe® are registered trademarks of Abhishek Choudhary.</p><h2>Licence</h2><p>This project is distributed under GPL-3.0-only. The complete licence text is included as <code>LICENSE</code> in the source repository. This page is a summary and does not replace the full licence text.</p><p><a class="button secondary" href="https://github.com/OWNER/REPOSITORY/blob/main/LICENSE">Read full GPL-3.0-only text ↗</a></p><p>Copyright and trademark notices are retained. AyeAI®, AyeAM® and AyeCNSe® are registered trademarks. GPL-3.0-only grants copyright-licence permissions for the covered software; it does not grant trademark rights. Third-party contributions retain their respective copyright and licence terms.</p></main><footer class="footer"><div class="wrap footer-inner"><b>CVAS · Iteration 2</b><small>Copyright © 1993-2026 Abhishek Choudhary. All rights reserved. AyeAI®, AyeAM® and AyeCNSe® are registered trademarks of Abhishek Choudhary.</small></div></footer></body></html>
+<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>License & Notices | CVAS</title><link rel="icon" href="assets/mark.svg"><link rel="stylesheet" href="assets/site.css"></head><body><header class="topbar"><a class="brand" href="index.html"><img src="assets/mark.svg" width="34" alt=""><span>CVAS <small>Cloud Source Harness</small></span></a><nav><a href="index.html">Overview</a><a href="contract.html">Contract</a></nav></header><section class="subhero"><div class="wrap"><div class="eyebrow">LEGAL & ATTRIBUTION</div><h1>Copyright, marks<br><em>and licence.</em></h1><p>Project identity and licensing information for this independent seed.</p></div></section><main class="wrap content"><h2>Copyright and trademarks</h2><p>Copyright © 1993-2026 Abhishek Choudhary. All rights reserved. AyeAI®, AyeAM® and AyeCNSe® are registered trademarks of Abhishek Choudhary.</p><h2>Licence</h2><p>This project is distributed under GPL-3.0-only. The complete licence text is included as <code>LICENSE</code> in the source repository. This page is a summary and does not replace the full licence text.</p><p><a class="button secondary" href="https://github.com/zistgah/cvas/blob/main/LICENSE">Read full GPL-3.0-only text ↗</a></p><p>Copyright and trademark notices are retained. AyeAI®, AyeAM® and AyeCNSe® are registered trademarks. GPL-3.0-only grants copyright-licence permissions for the covered software; it does not grant trademark rights. Third-party contributions retain their respective copyright and licence terms.</p></main><footer class="footer"><div class="wrap footer-inner"><b>CVAS · Iteration 2</b><small>Copyright © 1993-2026 Abhishek Choudhary. All rights reserved. AyeAI®, AyeAM® and AyeCNSe® are registered trademarks of Abhishek Choudhary.</small></div></footer></body></html>
--- origin/staging/plagiarism.mjs
+++ staging/plagiarism.mjs
@@ -41,7 +41,8 @@
 
 export function localIndex(submission, index, { threshold = 0.6, n = 3 } = {}) {
   if (!submission) return { outcome: "HOLD", reason: "Submission is UNSPECIFIED" };
-  if (!Array.isArray(index) || !index.length) return { outcome: "OK", overlap: 0, note: "Index is empty" };
+  if (!Array.isArray(index)) return { outcome: "HOLD", reason: "Index is not a list" };
+  if (!index.length) return { outcome: "OK", overlap: 0, note: "Index is empty" };
   const mine = new Set(grams(submission, n));
   if (!mine.size) return { outcome: "OK", overlap: 0, note: "Too short" };
   let max = 0, match = null;
--- origin/staging/test.mjs
+++ staging/test.mjs
@@ -4,7 +4,7 @@
  * AyeAI®, AyeAM® and AyeCNSe® are registered trademarks of Abhishek Choudhary.
  */
 import { issueTicket } from "./ticket.mjs";
-import { checkOverlap } from "./plagiarism.mjs";
+import { localIndex as checkOverlap } from "./plagiarism.mjs";
 import { createIndex } from "./index.mjs";
 import { acceptPolicy } from "./policy.mjs";
 
--- origin/.github/workflows/pull-request-policy.yml
+++ .github/workflows/pull-request-policy.yml
@@ -17,7 +17,7 @@
         shell: bash
         run: |
           set -euo pipefail
-          if grep -R -n "pull_request_target" .github/workflows; then
+          if grep -R -n --exclude=pull-request-policy.yml -E "^[[:space:]]*(on:.*)?pull_request_target" .github/workflows; then
             echo "Privileged pull_request_target workflow requires security review."
             exit 1
           fi
--- origin/.github/workflows/cvas-ci.yml
+++ .github/workflows/cvas-ci.yml
@@ -35,6 +35,11 @@
         run: node pipeline/verify.mjs examples/python-sample --json-out cvas-python-via-js-report.json
       - name: Verify retained Python compatibility verifier
         run: python pipeline/verify.py examples/python-sample --json-out cvas-python-native-report.json
+      - name: Run staging, plagiarism and global-check tests
+        run: |
+          node staging/test.mjs
+          node staging/test-plagiarism.mjs
+          node staging/test-global.mjs
       - name: Upload verification report
         if: always()
         uses: actions/upload-artifact@v4
--- origin/CHANGELOG.md
+++ CHANGELOG.md
@@ -2,6 +2,18 @@
 
 Copyright © 1993-2026 Abhishek Choudhary. All rights reserved. AyeAI®, AyeAM® and AyeCNSe® are registered trademarks of Abhishek Choudhary.
 
+## Alpha 0.1.0 - iteration 8 seeded and minted
+
+- The staging test imports the local-index check under its iteration 8 name, and a non-list index is refused again, as that test asserts.
+- The pull-request policy check no longer finds its own text; it still holds a workflow that uses pull_request_target.
+- CI also runs the staging, plagiarism and global-check tests.
+- Site and README links point at the published repository.
+- Added CITATION.cff, misty.json and ops/verify.sh, the repository's gate.
+- Every change is listed in origin/SEED-DIFF.md, with each original kept under origin/.
+
+
+Copyright © 1993-2026 Abhishek Choudhary. All rights reserved. AyeAI®, AyeAM® and AyeCNSe® are registered trademarks of Abhishek Choudhary.
+
 ## Iteration 8 - free plagiarism with abstraction
 
 - A free text check fingerprints phrases and evaluates a search backend.
--- origin/VERIFICATION-REPORT.md
+++ VERIFICATION-REPORT.md
@@ -37,3 +37,20 @@
 - GitHub Actions and GitHub Pages were not run against a live remote repository.
 - No hostile-code sandbox, external certification or production deployment is claimed.
 - The static site is ready for publication from `docs/` using the included Pages workflow, after repository owner configuration.
+
+## Alpha 0.1.0 (iteration 8), executed when seeded
+
+| Check | Result |
+|---|---|
+| Python verifier unit tests | 3/3 PASS |
+| JavaScript verifier on the Node sample | INCOMPLETE by design: 27 PASS, 2 SKIP, 1 NOT_APPLICABLE |
+| JavaScript verifier on the Python sample | INCOMPLETE by design, no failed check |
+| Python verifier on the Python sample | INCOMPLETE by design, no failed check |
+| Staging tests | PASS (failed at import before this release) |
+| Plagiarism and global-check tests | PASS |
+| Pull-request policy step | PASS on this repository; holds a planted pull_request_target workflow |
+| Workflows and CITATION.cff | parse |
+| Static site, 8 pages in Chromium | no page errors, no failed requests, no broken local links |
+
+Not executed here: the notebook in Google's live Colab, and the workflows on GitHub before the first push.
+Known limitation: the mutation-test check runs the contributor's script and passes whenever it exits 0, so an empty mutation test passes; see the brief for the fix.
```
