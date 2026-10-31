# Threat model and limitations

Copyright © 1993-2026 Abhishek Choudhary. All rights reserved. AyeAI®, AyeAM® and AyeCNSe® are registered trademarks of Abhishek Choudhary.

## Assets to protect

Canonical source, project secrets, release credentials, evidence integrity, upstream branches, dependency graph, build outputs and reviewer authority.

## Threats

- malicious code in a component or test;
- archive path traversal, symlinks or decompression bombs;
- credential exfiltration from notebook or CI runtime;
- manifest lies or risk-class downgrade;
- tests that only assert their own implementation;
- dependency confusion, typosquatting or malicious post-install scripts;
- CI workflow modification to steal tokens or bypass gates;
- generated files or test deletion hiding regressions;
- unbounded CPU, memory, filesystem or network use;
- false claims of qualification based on skipped checks.

## Controls in this seed

- safe ZIP path validation and file-count/size limits;
- manifest schema and required-field checks;
- fixed test runners for supported runtimes;
- execution timeout and no secrets in CI;
- heuristic embedded-secret scan as a signal, not a security proof;
- explicit SKIP and HOLD semantics;
- report hashes and source provenance;
- risk-based human-review routing.

## Controls required from adopting project

- protected branches and required status checks;
- CODEOWNERS and two-person Class C approval;
- isolated ephemeral runners, ideally containers/VMs with network disabled;
- CPU, memory, disk and process limits;
- dependency pinning, lockfiles, SBOM and vulnerability scanning;
- signed releases and attestations;
- project-specific semantic, security and domain validation;
- independent reviewer authorisation.

## Colab limitation

Google Colab is a browser-accessible hosted notebook environment, not a security sandbox for hostile code. The notebook is suitable for voluntary contributors running their own submissions. It must not be used by maintainers to execute unknown code in a runtime containing secrets, mounted Drive data or privileged credentials.

## What this harness does not prove

It does not prove total correctness, physical safety, numerical validity, absence of malicious behaviour, certification, or compatibility with an adopting project's undocumented requirements. It provides a reusable verification scaffold that projects must extend.
