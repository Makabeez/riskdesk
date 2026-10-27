---
test: ../C07-display-trap-actual-risk-within-a-half-c_test.md
status: passed
started: 2026-10-27T21:15:31.306Z
duration_s: 87
session_id: 196b5ecb-8590-4054-a49b-2184c523d91f
---

# C07-display-trap-actual-risk-within-a-half-c_test.md — Result

## Enter the trade ✓ passed (54.2s)
md5: 700910a67ecce1b883d89a38de8e83dc
In the Account panel, clear the "Account balance" field and type 10000.75. Clear the "Risk per trade" field and type 1. In the Position panel, click "ETH-PERP", then click "Long". Clear the "Leverage" field and type 10. Clear the "Entry price" field and type 3000. Clear the "Stop loss" field and type 2944.13.

## Check the size and the risk ✓ passed (28.8s)
md5: 0638ee22fc7f0a46a9e1e6e3c38d2841
Verify that the Result panel shows a position size of exactly 1.79 ETH, that the actual risk shown is at most $100.01, and that the actual risk shown is not greater than the risk budget the page shows under the "Risk per trade" field (balance 10000.75 multiplied by 1% is $100.01 rounded to the cent). Store the displayed position size as displayed_size and the displayed actual risk as displayed_risk.
