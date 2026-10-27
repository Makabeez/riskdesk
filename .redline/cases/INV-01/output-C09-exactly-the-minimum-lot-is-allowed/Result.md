---
test: ../C09-exactly-the-minimum-lot-is-allowed_test.md
status: passed
started: 2026-10-27T21:18:36.392Z
duration_s: 88
session_id: beaaa7ba-4b7c-43b0-b5ae-1d4dc2cd9634
---

# C09-exactly-the-minimum-lot-is-allowed_test.md — Result

## Enter the trade ✓ passed (54.5s)
md5: 6e5c89d6e57cd0bb0207ab9ac18e2c21
In the Account panel, clear the "Account balance" field and type 10000. Clear the "Risk per trade" field and type 0.1. In the Position panel, click "BTC-PERP", then click "Long". Clear the "Leverage" field and type 10. Clear the "Entry price" field and type 60000. Clear the "Stop loss" field and type 50000.

## Check the size and the risk ✓ passed (30.6s)
md5: 7c87b481a8ceff5771daebb83f657168
Verify that the Result panel shows a position size of exactly 0.001 BTC, that the actual risk shown is exactly $10.00, and that the actual risk shown is not greater than the risk budget the page shows under the "Risk per trade" field (balance 10000 multiplied by 0.1% is $10.00 rounded to the cent). Store the displayed position size as displayed_size and the displayed actual risk as displayed_risk.
