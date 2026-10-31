---
test: ../V01-fee-example-on-eth-1-37-not-1-42_test.md
status: passed
started: 2026-10-31T01:59:38.043Z
duration_s: 94
session_id: 336bf175-2423-45c2-95c8-761c7f70bd87
---

# V01-fee-example-on-eth-1-37-not-1-42_test.md — Result

## Enter the trade ✓ passed (39.7s)
md5: 718967abf6205ede6d9e2dd625632ab2
In the Account panel, clear the "Account balance" field and type 10000. Clear the "Risk per trade" field and type 1. Clear the "Fee per side" field and type 0.05. In the Position panel, click "ETH-PERP", then click "Long". Clear the "Leverage" field and type 10. Clear the "Entry price" field and type 3000. Clear the "Stop loss" field and type 2930.

## Check the size and the risk ✓ passed (26.3s)
md5: 45dc964a992ac208d9113a796dafaf08
Verify that the Result panel shows a position size of exactly 1.37 ETH, that the actual risk shown is exactly $99.96, which is within the $100.00 risk budget (balance 10000 multiplied by 1%). Store the displayed position size as displayed_size and the displayed actual risk as displayed_risk.

## Reset the fee ✓ passed (16.5s)
md5: fd70d33bec00636b42518a5d611d02ac
In the Account panel, clear the "Fee per side" field and type 0.
