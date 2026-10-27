---
test: ../V01-fee-example-on-eth-1-37-not-1-42_test.md
status: passed
started: 2026-10-27T22:05:01.262Z
duration_s: 108
session_id: f86fb8d0-7da1-4e78-a0e6-26e391024716
---

# V01-fee-example-on-eth-1-37-not-1-42_test.md — Result

## Enter the trade ✓ passed (54.6s)
md5: 718967abf6205ede6d9e2dd625632ab2
In the Account panel, clear the "Account balance" field and type 10000. Clear the "Risk per trade" field and type 1. Clear the "Fee per side" field and type 0.05. In the Position panel, click "ETH-PERP", then click "Long". Clear the "Leverage" field and type 10. Clear the "Entry price" field and type 3000. Clear the "Stop loss" field and type 2930.

## Check the size and the risk ✓ passed (33.7s)
md5: fd64d779ec52c3cf7e9a65d262b38b06
Verify that the Result panel shows a position size of exactly 1.37 ETH, that the actual risk shown is exactly $99.96, and that the actual risk shown is not greater than the risk budget the page shows under the "Risk per trade" field. Store the displayed position size as displayed_size and the displayed actual risk as displayed_risk.

## Reset the fee ✓ passed (16.4s)
md5: fd70d33bec00636b42518a5d611d02ac
In the Account panel, clear the "Fee per side" field and type 0.
