---
test: ../C06-fractional-cent-budget-nearest-lot-overs_test.md
status: passed
started: 2026-10-27T21:13:42.720Z
duration_s: 95
session_id: d8caa553-7fdd-4a36-af5d-19a780655c24
---

# C06-fractional-cent-budget-nearest-lot-overs_test.md — Result

## Enter the trade ✓ passed (56.2s)
md5: b9332deca777dc1c659534f7622a2e3b
In the Account panel, clear the "Account balance" field and type 10000.37. Clear the "Risk per trade" field and type 1. In the Position panel, click "ETH-PERP", then click "Long". Clear the "Leverage" field and type 10. Clear the "Entry price" field and type 3000. Clear the "Stop loss" field and type 2999.7.

## Check the size and the risk ✓ passed (35.8s)
md5: 7173c1566fa5d6c3f781666f85f863e6
Verify that the Result panel shows a position size of exactly 333.34 ETH, that the actual risk shown is at most $100.00, and that the actual risk shown is not greater than the risk budget the page shows under the "Risk per trade" field (balance 10000.37 multiplied by 1% is $100.00 rounded to the cent). Store the displayed position size as displayed_size and the displayed actual risk as displayed_risk.
