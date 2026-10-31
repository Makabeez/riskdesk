---
test: ../C09-exactly-the-minimum-lot-is-allowed_test.md
status: passed
started: 2026-10-31T01:29:13.066Z
duration_s: 83
session_id: 9af4184a-579b-4740-9e0b-0498d32555ef
---

# C09-exactly-the-minimum-lot-is-allowed_test.md — Result

## Enter the trade ✓ passed (46.9s)
md5: 6e5c89d6e57cd0bb0207ab9ac18e2c21
In the Account panel, clear the "Account balance" field and type 10000. Clear the "Risk per trade" field and type 0.1. In the Position panel, click "BTC-PERP", then click "Long". Clear the "Leverage" field and type 10. Clear the "Entry price" field and type 60000. Clear the "Stop loss" field and type 50000.

## Check the size and the risk ✓ passed (24.1s)
md5: 0980ffe7baa3044b396dc5a5e6fceb91
Verify that the Result panel shows a position size of exactly 0.001 BTC and that the actual risk shown is exactly $10.00. The risk budget here is 10000 multiplied by 0.1%, which is $10.00 to the cent: the actual risk shown must not be greater than that. Store the displayed position size as displayed_size and the displayed actual risk as displayed_risk.
