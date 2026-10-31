# Copyright © 1993-2026 Abhishek Choudhary. All rights reserved. AyeAI®, AyeAM® and AyeCNSe® are registered trademarks of Abhishek Choudhary.
# Demonstrates that the Python test harness rejects an intentionally wrong result.
def mutant(value):
    return value * 3
assert mutant(2) != 4
print("PASS: deliberate Python mutant differs from reference")
