---
test: ../V02-fee-example-on-btc-0-094_test.md
status: passed
started: 2026-10-31T02:01:18.012Z
duration_s: 90
session_id: 7fccc989-96ce-4694-84a1-f2c6ae7e0783
---

# V02-fee-example-on-btc-0-094_test.md — Result

## Enter the trade ✓ passed (38.8s)
md5: a182508d514d6c048e0b692d3e0343f2
In the Account panel, clear the "Account balance" field and type 10000. Clear the "Risk per trade" field and type 1. Clear the "Fee per side" field and type 0.05. In the Position panel, click "BTC-PERP", then click "Long". Clear the "Leverage" field and type 10. Clear the "Entry price" field and type 60000. Clear the "Stop loss" field and type 59000.

## Check the size and the risk ✓ passed (24.1s)
md5: 087f5e57990da08a5609e28e6aa55c4b
Verify that the Result panel shows a position size of exactly 0.094 BTC, that the actual risk shown is exactly $99.59, which is within the $100.00 risk budget (balance 10000 multiplied by 1%). Store the displayed position size as displayed_size and the displayed actual risk as displayed_risk.

## Reset the fee ✓ passed (15.3s)
md5: fd70d33bec00636b42518a5d611d02ac
In the Account panel, clear the "Fee per side" field and type 0.
