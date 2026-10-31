---
test: ../C07-display-trap-actual-risk-within-a-half-c_test.md
status: passed
started: 2026-10-31T01:26:39.030Z
duration_s: 72
session_id: 88d17257-7fb6-4718-b54f-13eca2b705cd
---

# C07-display-trap-actual-risk-within-a-half-c_test.md — Result

## Enter the trade ✓ passed (36.6s)
md5: 700910a67ecce1b883d89a38de8e83dc
In the Account panel, clear the "Account balance" field and type 10000.75. Clear the "Risk per trade" field and type 1. In the Position panel, click "ETH-PERP", then click "Long". Clear the "Leverage" field and type 10. Clear the "Entry price" field and type 3000. Clear the "Stop loss" field and type 2944.13.

## Check the size and the risk ✓ passed (24.9s)
md5: de7195b578be4b32acf9da9b0768b428
Verify that the Result panel shows a position size of exactly 1.79 ETH and that the actual risk shown is at most $100.01. The risk budget here is 10000.75 multiplied by 1%, which is $100.01 to the cent: the actual risk shown must not be greater than that. Store the displayed position size as displayed_size and the displayed actual risk as displayed_risk.
