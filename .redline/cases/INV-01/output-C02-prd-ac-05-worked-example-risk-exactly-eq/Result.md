---
test: ../C02-prd-ac-05-worked-example-risk-exactly-eq_test.md
status: passed
started: 2026-10-27T21:08:30.287Z
duration_s: 92
session_id: 7ca3ed6a-2197-4b39-8ed8-a79fda592235
---

# C02-prd-ac-05-worked-example-risk-exactly-eq_test.md — Result

## Enter the trade ✓ passed (50.3s)
md5: cb850fcc7bf09723db3686c36f069db9
In the Account panel, clear the "Account balance" field and type 10000. Clear the "Risk per trade" field and type 1. In the Position panel, click "BTC-PERP", then click "Long". Clear the "Leverage" field and type 10. Clear the "Entry price" field and type 60000. Clear the "Stop loss" field and type 59000.

## Check the size and the risk ✓ passed (38.5s)
md5: c39a4930654590a5f512e069b3f80ff5
Verify that the Result panel shows a position size of exactly 0.100 BTC, that the actual risk shown is exactly $100.00, and that the actual risk shown is not greater than the risk budget the page shows under the "Risk per trade" field (balance 10000 multiplied by 1% is $100.00 rounded to the cent). Store the displayed position size as displayed_size and the displayed actual risk as displayed_risk.
