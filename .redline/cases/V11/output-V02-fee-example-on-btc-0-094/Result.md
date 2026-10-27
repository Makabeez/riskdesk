---
test: ../V02-fee-example-on-btc-0-094_test.md
status: passed
started: 2026-10-27T22:07:02.658Z
duration_s: 112
session_id: a0e80531-1f13-430a-ac5b-7eb82645f5b6
---

# V02-fee-example-on-btc-0-094_test.md — Result

## Enter the trade ✓ passed (58.1s)
md5: a182508d514d6c048e0b692d3e0343f2
In the Account panel, clear the "Account balance" field and type 10000. Clear the "Risk per trade" field and type 1. Clear the "Fee per side" field and type 0.05. In the Position panel, click "BTC-PERP", then click "Long". Clear the "Leverage" field and type 10. Clear the "Entry price" field and type 60000. Clear the "Stop loss" field and type 59000.

## Check the size and the risk ✓ passed (35.5s)
md5: 46de84d328ae25ac84231f8d8bd653ea
Verify that the Result panel shows a position size of exactly 0.094 BTC, that the actual risk shown is exactly $99.59, and that the actual risk shown is not greater than the risk budget the page shows under the "Risk per trade" field. Store the displayed position size as displayed_size and the displayed actual risk as displayed_risk.

## Reset the fee ✓ passed (15s)
md5: fd70d33bec00636b42518a5d611d02ac
In the Account panel, clear the "Fee per side" field and type 0.
