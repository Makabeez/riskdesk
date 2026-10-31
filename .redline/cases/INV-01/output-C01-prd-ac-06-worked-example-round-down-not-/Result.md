---
test: ../C01-prd-ac-06-worked-example-round-down-not-_test.md
status: passed
started: 2026-10-31T01:18:20.407Z
duration_s: 76
session_id: e551329a-4982-4424-8899-92150742ac78
---

# C01-prd-ac-06-worked-example-round-down-not-_test.md — Result

## Enter the trade ✓ passed (33.1s)
md5: c5520b7b4c0241d854f26320f2974cb8
In the Account panel, clear the "Account balance" field and type 10000. Clear the "Risk per trade" field and type 1. In the Position panel, click "ETH-PERP", then click "Long". Clear the "Leverage" field and type 10. Clear the "Entry price" field and type 3000. Clear the "Stop loss" field and type 2930.

## Check the size and the risk ✓ passed (31s)
md5: c2dc3a3252780520ecd927acc98117f4
Verify that the Result panel shows a position size of exactly 1.42 ETH and that the actual risk shown is exactly $99.40. The risk budget here is 10000 multiplied by 1%, which is $100.00 to the cent: the actual risk shown must not be greater than that. Store the displayed position size as displayed_size and the displayed actual risk as displayed_risk.
