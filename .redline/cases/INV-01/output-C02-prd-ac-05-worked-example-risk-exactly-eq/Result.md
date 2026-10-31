---
test: ../C02-prd-ac-05-worked-example-risk-exactly-eq_test.md
status: passed
started: 2026-10-31T01:19:42.558Z
duration_s: 77
session_id: 5513683f-f55b-47a1-8a29-fc58430d7ee7
---

# C02-prd-ac-05-worked-example-risk-exactly-eq_test.md — Result

## Enter the trade ✓ passed (41.9s)
md5: cb850fcc7bf09723db3686c36f069db9
In the Account panel, clear the "Account balance" field and type 10000. Clear the "Risk per trade" field and type 1. In the Position panel, click "BTC-PERP", then click "Long". Clear the "Leverage" field and type 10. Clear the "Entry price" field and type 60000. Clear the "Stop loss" field and type 59000.

## Check the size and the risk ✓ passed (24.1s)
md5: a487223f4bff7fd7d51c28d260c43350
Verify that the Result panel shows a position size of exactly 0.100 BTC and that the actual risk shown is exactly $100.00. The risk budget here is 10000 multiplied by 1%, which is $100.00 to the cent: the actual risk shown must not be greater than that. Store the displayed position size as displayed_size and the displayed actual risk as displayed_risk.
