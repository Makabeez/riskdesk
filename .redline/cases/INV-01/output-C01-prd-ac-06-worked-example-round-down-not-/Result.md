---
test: ../C01-prd-ac-06-worked-example-round-down-not-_test.md
status: passed
started: 2026-10-27T21:00:07.173Z
duration_s: 78
session_id: f86f603d-323b-4106-80a7-cb6ba4e379ff
---

# C01-prd-ac-06-worked-example-round-down-not-_test.md — Result

## Enter the trade ✓ passed (41s)
md5: c5520b7b4c0241d854f26320f2974cb8
In the Account panel, clear the "Account balance" field and type 10000. Clear the "Risk per trade" field and type 1. In the Position panel, click "ETH-PERP", then click "Long". Clear the "Leverage" field and type 10. Clear the "Entry price" field and type 3000. Clear the "Stop loss" field and type 2930.

## Check the size and the risk ✓ passed (32.2s)
md5: 35a74dfbc51fa11f160154750fb92d10
Verify that the Result panel shows a position size of exactly 1.42 ETH, that the actual risk shown is exactly $99.40, and that the actual risk shown is not greater than the risk budget the page shows under the "Risk per trade" field (balance 10000 multiplied by 1% is $100.00 rounded to the cent). Store the displayed position size as displayed_size and the displayed actual risk as displayed_risk.
