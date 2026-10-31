---
test: ../V04-fees-on-a-short_test.md
status: passed
started: 2026-10-31T02:04:31.031Z
duration_s: 103
session_id: 909da0c1-30e3-433a-b63d-7c12377e995c
---

# V04-fees-on-a-short_test.md — Result

## Enter the trade ✓ passed (54.3s)
md5: e3cd034cbdea4befbb01bda32d74e199
In the Account panel, clear the "Account balance" field and type 10000. Clear the "Risk per trade" field and type 1. Clear the "Fee per side" field and type 0.05. In the Position panel, click "ETH-PERP", then click "Short". Clear the "Leverage" field and type 10. Clear the "Entry price" field and type 3000. Clear the "Stop loss" field and type 3020.

## Check the size and the risk ✓ passed (22.3s)
md5: e4bee9c90de659477756c611734c69eb
Verify that the Result panel shows a position size of exactly 4.34 ETH, that the actual risk shown is exactly $99.86, which is within the $100.00 risk budget (balance 10000 multiplied by 1%). Store the displayed position size as displayed_size and the displayed actual risk as displayed_risk.

## Reset the fee ✓ passed (14.4s)
md5: fd70d33bec00636b42518a5d611d02ac
In the Account panel, clear the "Fee per side" field and type 0.
