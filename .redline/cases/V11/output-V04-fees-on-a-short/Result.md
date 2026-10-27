---
test: ../V04-fees-on-a-short_test.md
status: passed
started: 2026-10-27T22:11:02.524Z
duration_s: 100
session_id: 60088342-911b-4b50-a2dc-8d63716e33ce
---

# V04-fees-on-a-short_test.md — Result

## Enter the trade ✓ passed (47.3s)
md5: e3cd034cbdea4befbb01bda32d74e199
In the Account panel, clear the "Account balance" field and type 10000. Clear the "Risk per trade" field and type 1. Clear the "Fee per side" field and type 0.05. In the Position panel, click "ETH-PERP", then click "Short". Clear the "Leverage" field and type 10. Clear the "Entry price" field and type 3000. Clear the "Stop loss" field and type 3020.

## Check the size and the risk ✓ passed (32.4s)
md5: d01254790e637f96b4244984451d37bc
Verify that the Result panel shows a position size of exactly 4.34 ETH, that the actual risk shown is exactly $99.86, and that the actual risk shown is not greater than the risk budget the page shows under the "Risk per trade" field. Store the displayed position size as displayed_size and the displayed actual risk as displayed_risk.

## Reset the fee ✓ passed (17.3s)
md5: fd70d33bec00636b42518a5d611d02ac
In the Account panel, clear the "Fee per side" field and type 0.
