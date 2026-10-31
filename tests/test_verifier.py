"""Verifier regression tests. Copyright © 1993-2026 Abhishek Choudhary. All rights reserved. AyeAI®, AyeAM® and AyeCNSe® are registered trademarks of Abhishek Choudhary."""
import json, tempfile, unittest
from pathlib import Path
from pipeline.verify import verify

ROOT=Path(__file__).resolve().parents[1]
SAMPLE=ROOT/"examples"/"sample-component"

class VerifierTests(unittest.TestCase):
    def test_reference_component_is_incomplete_pending_independent_reference_attestation(self):
        report=verify(SAMPLE)
        self.assertEqual(report["outcome"],"INCOMPLETE")
        outcomes={c["name"]:c["outcome"] for c in report["checks"]}
        self.assertEqual(outcomes["executable-test"],"PASS")
        self.assertEqual(outcomes["mutation-test"],"PASS")
        self.assertEqual(outcomes["independent-reference-evidence"],"SKIP")

    def test_missing_manifest_fails(self):
        with tempfile.TemporaryDirectory() as td:
            report=verify(Path(td))
            self.assertEqual(report["outcome"],"FAIL")

    def test_critical_component_routes_human_review(self):
        with tempfile.TemporaryDirectory() as td:
            dst=Path(td)
            for p in SAMPLE.iterdir():
                if p.is_file(): (dst/p.name).write_bytes(p.read_bytes())
            m=json.loads((dst/"manifest.json").read_text())
            m["riskClass"]="C"
            (dst/"manifest.json").write_text(json.dumps(m,ensure_ascii=False))
            report=verify(dst)
            self.assertEqual(report["outcome"],"INCOMPLETE")
            self.assertTrue(report["review"]["twoIndependentApprovalsRequired"])

if __name__=="__main__": unittest.main()
