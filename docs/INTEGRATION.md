# Adopting CVAS in another project

Copyright © 1993-2026 Abhishek Choudhary. All rights reserved. AyeAI®, AyeAM® and AyeCNSe® are registered trademarks of Abhishek Choudhary.

## 1. Keep project authority local

Do not copy PAP-specific requirements into another project. Copy this harness and provide your own:
- canonical requirement IDs and schemas;
- interface/ABI versions;
- domain test vectors and independent reference implementations;
- risk-class policy and authorised reviewer roles;
- dependency and compatibility policy;
- release and signing authority.

## 2. Minimum integration steps

1. Add the harness files to the project repository or reference a pinned release.
2. Set repository default branch and protect it.
3. Enable GitHub Actions for forks and pull requests.
4. Set workflow token permissions to read-only. Do not add secrets to untrusted PR workflows.
5. Require CI status checks before merge.
6. For Class C paths, configure CODEOWNERS and require two approvals, including the relevant domain owner. Configure branch protection or rulesets; a YAML file alone cannot enforce this.
7. Add project-specific validators and reference tests to `pipeline/project_checks.py` (or an equivalent controlled extension).
8. Define which files/paths trigger Class B/C review.
9. Retain reports as workflow artifacts. Sign release artifacts only in a trusted upstream workflow after approval.
10. Test withdrawal and substitution of a component before declaring it replaceable.

## 3. Manifest

See `templates/manifest.json`. `riskClass` is the contributor's declared minimum risk, not an authority to downgrade project policy. The upstream project should maintain path-based and dependency-based overrides.

## 4. Colab

Publish `notebooks/cvas-cloud-harness.ipynb` in the repository and replace `OWNER/REPOSITORY` in README. A collaborator opens it in a browser, uploads a component ZIP, and runs the notebook. No desktop IDE is required. The notebook executes uploaded code in its own runtime, so contributors must not mount Drive or enter secrets when inspecting untrusted code.

## 5. CI/CD distinction

CI verifies. Merge authority is controlled by protected-branch rules. CD/release uses a separate trusted workflow with protected environments and release credentials unavailable to fork workflows. Never use `pull_request_target` to execute untrusted PR code with privileged permissions.


## Web-first / JavaScript-first implementation

New generic harness features should use browser-native JavaScript or Node.js wherever practical. Python remains supported for Python components and scientific workloads. The Colab notebook uses Python for Colab-specific file APIs and safe archive orchestration, then invokes the JavaScript verifier. Read `../CONTRACT.md` for mandatory AI-agent instructions.
