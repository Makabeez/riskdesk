---
test: ../C04-float-trap-on-sol-exact-lot-count-floats_test.md
status: passed
started: 2026-10-31T01:22:28.674Z
duration_s: 78
session_id: 0449072d-2229-4d8e-b360-ffc7ac773047
---

# C04-float-trap-on-sol-exact-lot-count-floats_test.md — Result

## Enter the trade ✓ passed (41.1s)
md5: 020582b584cd87dd8f5b06aff1564b94
In the Account panel, clear the "Account balance" field and type 10000. Clear the "Risk per trade" field and type 0.3. In the Position panel, click "SOL-PERP", then click "Long". Clear the "Leverage" field and type 10. Clear the "Entry price" field and type 150. Clear the "Stop loss" field and type 149.7.

## Check the size and the risk ✓ passed (24.7s)
md5: f4e3fac815a6fa6d2381e3c5c9b37d42
Verify that the Result panel shows a position size of exactly 100.0 SOL and that the actual risk shown is exactly $30.00. The risk budget here is 10000 multiplied by 0.3%, which is $30.00 to the cent: the actual risk shown must not be greater than that. Store the displayed position size as displayed_size and the displayed actual risk as displayed_risk.
