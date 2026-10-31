---
test: ../V06-xrp-sizes-in-whole-units_test.md
status: passed
started: 2026-10-31T02:07:59.794Z
duration_s: 79
session_id: bea0e186-ed71-40d2-9999-9a0d9e2f56db
---

# V06-xrp-sizes-in-whole-units_test.md — Result

## Enter the trade ✓ passed (42.6s)
md5: 9fafcd33d434fbb13d575392a769fa9d
In the Account panel, clear the "Account balance" field and type 10000. Clear the "Risk per trade" field and type 1. Clear the "Fee per side" field and type 0. In the Position panel, click "XRP-PERP", then click "Long". Clear the "Leverage" field and type 10. Clear the "Entry price" field and type 0.50. Clear the "Stop loss" field and type 0.48.

## Check the size and the risk ✓ passed (24.7s)
md5: 8f3176ef33b2f8dd169aa3d804d7714a
Verify that the Result panel shows a position size of exactly 5,000 XRP (written 5,000 or 5000), that the actual risk shown is exactly $100.00, which is within the $100.00 risk budget (balance 10000 multiplied by 1%). Store the displayed position size as displayed_size and the displayed actual risk as displayed_risk.
