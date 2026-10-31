---
test: ../L03-leverage-exactly-at-the-cap-is-allowed_test.md
status: passed
started: 2026-10-31T01:35:15.858Z
duration_s: 60
session_id: 89e718b2-7a8c-4ad2-8228-edbbe4258632
---

# L03-leverage-exactly-at-the-cap-is-allowed_test.md — Result

## Enter the trade ✓ passed (35.1s)
md5: 631cce73c98d3187a7c5204613931a43
In the Account panel, clear the "Account balance" field and type 10000. Clear the "Risk per trade" field and type 1. In the Position panel, click "ETH-PERP", then click "Long". Clear the "Leverage" field and type 50. Clear the "Entry price" field and type 3000. Clear the "Stop loss" field and type 2930.

## Check the cap itself is accepted ✓ passed (21.7s)
md5: 2a022f6589335f29b8b57a02ff07d7bf
Verify that no leverage error is shown, that the Result panel shows a position size of 1.42 ETH, and that the margin required shown is $85.20.
