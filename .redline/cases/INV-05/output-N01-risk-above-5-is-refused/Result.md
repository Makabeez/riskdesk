---
test: ../N01-risk-above-5-is-refused_test.md
status: passed
started: 2026-10-31T01:50:38.775Z
duration_s: 76
session_id: 3b850ca2-5088-4c26-a388-cf02ed790458
---

# N01-risk-above-5-is-refused_test.md — Result

## Enter the trade ✓ passed (46.2s)
md5: 7227fde99e01b5281ed97637faaadca5
In the Account panel, clear the "Account balance" field and type 10000. Clear the "Risk per trade" field and type 5.1. In the Position panel, click "ETH-PERP", then click "Long". Clear the "Entry price" field and type 3000. Clear the "Stop loss" field and type 2930.

## Check it is refused ✓ passed (26s)
md5: 0eb7e85a40c0cb5ffb510bd300de7c91
Verify that the page shows the message "Risk must be between 0.1% and 5%" and that the Result panel shows no position size. Verify that the texts "NaN", "Infinity" and "undefined" do not appear anywhere on the page.
