---
test: ../S04-flipping-side-after-a-result-re-validate_test.md
status: passed
started: 2026-10-31T01:40:38.010Z
duration_s: 71
session_id: a9b3ac87-4331-42cf-93e1-d802b8a23db0
---

# S04-flipping-side-after-a-result-re-validate_test.md — Result

## Enter a valid long ✓ passed (37.8s)
md5: f541248918580eda1b201a925b0adb05
In the Account panel, clear the "Account balance" field and type 10000. Clear the "Risk per trade" field and type 1. In the Position panel, click "ETH-PERP", then click "Long". Clear the "Entry price" field and type 3000. Clear the "Stop loss" field and type 2930. Verify that the Result panel shows a position size of 1.42 ETH.

## Flip to short without touching the prices ✓ passed (10.7s)
md5: d4bc98774440a79e69e293dd40ee4fa4
In the Position panel, click "Short".

## Check the result is withdrawn ✓ passed (19s)
md5: 3cf65fd20cad5a719fc7d7c7f8e9817b
Verify that the page shows the message "Stop loss must be above entry for a short" and that the Result panel no longer shows a position size.
