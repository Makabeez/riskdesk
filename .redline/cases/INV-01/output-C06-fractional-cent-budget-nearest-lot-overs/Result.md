---
test: ../C06-fractional-cent-budget-nearest-lot-overs_test.md
status: passed
started: 2026-10-31T01:25:15.115Z
duration_s: 78
session_id: 8247b887-ac58-429b-a8d9-a90172ea6db8
---

# C06-fractional-cent-budget-nearest-lot-overs_test.md — Result

## Enter the trade ✓ passed (39.9s)
md5: b9332deca777dc1c659534f7622a2e3b
In the Account panel, clear the "Account balance" field and type 10000.37. Clear the "Risk per trade" field and type 1. In the Position panel, click "ETH-PERP", then click "Long". Clear the "Leverage" field and type 10. Clear the "Entry price" field and type 3000. Clear the "Stop loss" field and type 2999.7.

## Check the size and the risk ✓ passed (26.4s)
md5: d9623321225f352e94d3ff59beb07974
Verify that the Result panel shows a position size of exactly 333.34 ETH and that the actual risk shown is at most $100.00. The risk budget here is 10000.37 multiplied by 1%, which is $100.00 to the cent: the actual risk shown must not be greater than that. Store the displayed position size as displayed_size and the displayed actual risk as displayed_risk.
