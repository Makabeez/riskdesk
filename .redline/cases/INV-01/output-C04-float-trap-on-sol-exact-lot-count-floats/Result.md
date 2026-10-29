---
test: ../C04-float-trap-on-sol-exact-lot-count-floats_test.md
status: passed
started: 2026-10-29T21:22:13.896Z
duration_s: 68
session_id: ae907d00-c598-4d5a-a1ff-5c987d8cd859
---

# C04-float-trap-on-sol-exact-lot-count-floats_test.md — Result

## Enter the trade ✓ passed (4.28s)
md5: 020582b584cd87dd8f5b06aff1564b94
In the Account panel, clear the "Account balance" field and type 10000. Clear the "Risk per trade" field and type 0.3. In the Position panel, click "SOL-PERP", then click "Long". Clear the "Leverage" field and type 10. Clear the "Entry price" field and type 150. Clear the "Stop loss" field and type 149.7.

## Check the size and the risk ✓ passed (30.1s)
md5: 1e8cae7c5bb65c96b1416075a7523fb0
Verify that the Result panel shows a position size of exactly 100.0 SOL, that the actual risk shown is exactly $30.00, and that the actual risk shown is not greater than the risk budget the page shows under the "Risk per trade" field (balance 10000 multiplied by 0.3% is $30.00 rounded to the cent). Store the displayed position size as displayed_size and the displayed actual risk as displayed_risk.
