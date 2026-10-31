# Contribution, Verification and Assurance System (CVAS)

Copyright © 1993-2026 Abhishek Choudhary. All rights reserved. AyeAI®, AyeAM® and AyeCNSe® are registered trademarks of Abhishek Choudhary.

## 1. Design objective

Make contribution simple while keeping acceptance rigorous. A contributor supplies an intention and a bounded artifact. The project supplies contracts, scaffolding, verification and controlled promotion.

## 2. Architecture

- **Contribution surface:** fork, task description, templates, Colab notebook and pull request.
- **Contract surface:** manifest, schemas, interfaces, preconditions, postconditions, invariants, failure semantics and dependencies.
- **Verification surface:** manifest/package validation, bounded executable tests, mutation testing, independent reference cases, project-specific adversarial tests and regression suites.
- **Assurance surface:** risk classification, review routing, evidence provenance and explicit promotion status.
- **Lifecycle surface:** substitution, deprecation, withdrawal, rollback and retained audit history.

## 3. Risk classes

| Class | Definition | Minimum acceptance |
|---|---|---|
| A - Replaceable | Isolated component, no privileged authority, bounded effects | Generic 110% automated checks plus project-specific tests |
| B - Significant | Broad dependants, important workflows, consequential state/data | Class A plus dependency impact report and independent technical review |
| C - Critical | Trusted kernel, safety boundary, authority, evidence integrity, canonical state or release control | Class B plus complete human review of all changes and two independent approvals, one domain-authorised |

Risk is determined by impact and authority, not contributor declaration alone. The upstream policy may raise a class; contributors cannot lower it. The smallest possible trusted computing base should remain Class C.

## 4. Replaceability and removal

A component must declare dependencies and state ownership. Consumers should depend on stable contracts rather than implementation details. Before removal, the project should compute downstream impact, test alternatives, migrate consumers, and retain source revision, evidence and release history. If no safe substitute exists, affected workflows must become explicitly unavailable or HOLD. The platform must not silently report success.

## 5. Evidence record

Each run records:
- component ID and version;
- source archive and source-tree SHA-256;
- manifest digest;
- verifier version;
- runtime versions;
- individual check outcomes and reasons;
- test stdout/stderr and exit status;
- timestamp in UTC;
- overall outcome and review requirement.

The JSON report is evidence of what this harness executed, not a certification.

## 6. Promotion states

`SUBMITTED -> STRUCTURALLY_VALID -> EXECUTED -> REFERENCE_VERIFIED -> REVIEW_REQUIRED (if risk demands) -> ACCEPTED_BY_PROJECT -> RELEASED_BY_PROJECT`

The generic harness can report structural validity, execution and review routing. It cannot grant project acceptance or release authority.

## 7. 110% policy

Do not reduce this to line coverage. Require test families that challenge the declared contract: normal, boundary, negative, malformed, missing, failure, invariants, independent references, regression, mutation testing and adversarial behaviour. Domain projects add numerical convergence, physical validation, security, timing, reliability or other specialised obligations as relevant.

## 8. AI-assisted contributions

AI may propose implementation, tests, documentation and remediation. It may not self-approve, self-promote or be treated as an independent reviewer of its own output. Separate originator, implementer, automated verifier, human reviewer and release authority where risk requires.
