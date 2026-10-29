---
test: ../C05-float-trap-on-eth-with-a-30-cent-stop_test.md
status: passed
started: 2026-10-29T21:23:36.625Z
duration_s: 41
session_id: 309ae6db-fb91-4fd4-ae67-38f37d239ac0
---

# C05-float-trap-on-eth-with-a-30-cent-stop_test.md — Result

## Enter the trade ✓ passed (5.15s)
md5: b01b3dc51c0d96d8e3da05f22f89aff9
In the Account panel, clear the "Account balance" field and type 2500. Clear the "Risk per trade" field and type 0.3. In the Position panel, click "ETH-PERP", then click "Long". Clear the "Leverage" field and type 10. Clear the "Entry price" field and type 3000. Clear the "Stop loss" field and type 2999.7.

## Check the size and the risk ✓ passed (31.7s)
md5: 790c8dc2459012fd507afb0e850f4186
Verify that the Result panel shows a position size of exactly 25.00 ETH, that the actual risk shown is exactly $7.50, and that the actual risk shown is not greater than the risk budget the page shows under the "Risk per trade" field (balance 2500 multiplied by 0.3% is $7.50 rounded to the cent). Store the displayed position size as displayed_size and the displayed actual risk as displayed_risk.
