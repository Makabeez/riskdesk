---
test: ../C03-prd-ac-09-worked-example-short-on-sol_test.md
status: passed
started: 2026-10-31T01:21:06.634Z
duration_s: 76
session_id: ab8c7bdc-f4b3-4681-98de-e78c06d80985
---

# C03-prd-ac-09-worked-example-short-on-sol_test.md — Result

## Enter the trade ✓ passed (40.3s)
md5: 3a49fc718d18b69536d2669897fb3e17
In the Account panel, clear the "Account balance" field and type 10000. Clear the "Risk per trade" field and type 1. In the Position panel, click "SOL-PERP", then click "Short". Clear the "Leverage" field and type 10. Clear the "Entry price" field and type 150. Clear the "Stop loss" field and type 156.

## Check the size and the risk ✓ passed (25.1s)
md5: c07f6b84e39692cfd4982a29795754ba
Verify that the Result panel shows a position size of exactly 16.6 SOL and that the actual risk shown is exactly $99.60. The risk budget here is 10000 multiplied by 1%, which is $100.00 to the cent: the actual risk shown must not be greater than that. Store the displayed position size as displayed_size and the displayed actual risk as displayed_risk.
