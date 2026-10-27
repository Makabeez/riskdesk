---
test: ../V06-xrp-sizes-in-whole-units_test.md
status: passed
started: 2026-10-27T22:14:51.040Z
duration_s: 80
session_id: 14a7c77e-5d64-4f80-bc19-880343fddb1d
---

# V06-xrp-sizes-in-whole-units_test.md — Result

## Enter the trade ✓ passed (45.4s)
md5: 9fafcd33d434fbb13d575392a769fa9d
In the Account panel, clear the "Account balance" field and type 10000. Clear the "Risk per trade" field and type 1. Clear the "Fee per side" field and type 0. In the Position panel, click "XRP-PERP", then click "Long". Clear the "Leverage" field and type 10. Clear the "Entry price" field and type 0.50. Clear the "Stop loss" field and type 0.48.

## Check the size and the risk ✓ passed (31s)
md5: 8144f552df7719e3c21787c54ebaa682
Verify that the Result panel shows a position size of exactly 5,000 XRP (written 5,000 or 5000), that the actual risk shown is exactly $100.00, and that the actual risk shown is not greater than the risk budget the page shows under the "Risk per trade" field. Store the displayed position size as displayed_size and the displayed actual risk as displayed_risk.
