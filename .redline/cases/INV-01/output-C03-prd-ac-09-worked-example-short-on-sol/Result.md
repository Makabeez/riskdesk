---
test: ../C03-prd-ac-09-worked-example-short-on-sol_test.md
status: passed
started: 2026-10-27T21:10:15.623Z
duration_s: 78
session_id: eb1449f1-a742-4ce6-8de9-40d540a8991a
---

# C03-prd-ac-09-worked-example-short-on-sol_test.md — Result

## Enter the trade ✓ passed (46.3s)
md5: 3a49fc718d18b69536d2669897fb3e17
In the Account panel, clear the "Account balance" field and type 10000. Clear the "Risk per trade" field and type 1. In the Position panel, click "SOL-PERP", then click "Short". Clear the "Leverage" field and type 10. Clear the "Entry price" field and type 150. Clear the "Stop loss" field and type 156.

## Check the size and the risk ✓ passed (28.8s)
md5: 8cbfee8bc8067b520c2d6b18c77ea167
Verify that the Result panel shows a position size of exactly 16.6 SOL, that the actual risk shown is exactly $99.60, and that the actual risk shown is not greater than the risk budget the page shows under the "Risk per trade" field (balance 10000 multiplied by 1% is $100.00 rounded to the cent). Store the displayed position size as displayed_size and the displayed actual risk as displayed_risk.
