# Copyright © 1993-2026 Abhishek Choudhary. All rights reserved. AyeAI®, AyeAM® and AyeCNSe® are registered trademarks of Abhishek Choudhary.
def run(payload):
    if not isinstance(payload, dict) or not isinstance(payload.get("value"), (int, float)):
        return {"status": "HOLD", "reason": "value must be numeric"}
    return {"status": "OK", "value": payload["value"] * 2}
