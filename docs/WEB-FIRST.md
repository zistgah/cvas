# Web-first, JavaScript-first policy

Copyright © 1993-2026 Abhishek Choudhary. All rights reserved. AyeAI®, AyeAM® and AyeCNSe® are registered trademarks of Abhishek Choudhary.

CVAS is designed for browser-first collaboration. GitHub Pages is a static HTML/CSS/JavaScript site. The primary verifier is Node.js (`pipeline/verify.mjs`). New generic features should use JavaScript when browser or Node APIs can perform the work.

Python is retained as a supported component runtime and for scientific workloads where its ecosystem is valuable. The Colab notebook uses Python only for Colab file upload/download, safe ZIP handling and orchestration; it invokes the JavaScript verifier for the primary path. Python is not removed or deprecated.

Human collaborators can use the standard contribution flow entirely in Google Colab. The browser workflow does not require a desktop IDE or local shell.

AI-agent instruction: read `CONTRACT.md` before changing the harness. Preserve the web-first and JavaScript-first policy, Python adapter, 110% verification policy, fail-closed outcomes, provenance, replaceability, risk classification, human review and licensing.
