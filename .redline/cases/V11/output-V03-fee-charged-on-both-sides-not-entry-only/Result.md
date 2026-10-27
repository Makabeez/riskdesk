---
test: ../V03-fee-charged-on-both-sides-not-entry-only_test.md
status: passed
started: 2026-10-27T22:09:07.768Z
duration_s: 102
session_id: 8611ca65-17a6-47d9-a384-0ecab080c540
---

# V03-fee-charged-on-both-sides-not-entry-only_test.md — Result

## Enter the trade ✓ passed (52.4s)
md5: 80017f6e9b10621e89a6b95abc43ad84
In the Account panel, clear the "Account balance" field and type 10000. Clear the "Risk per trade" field and type 1. Clear the "Fee per side" field and type 0.05. In the Position panel, click "ETH-PERP", then click "Long". Clear the "Leverage" field and type 10. Clear the "Entry price" field and type 3000. Clear the "Stop loss" field and type 2980.

## Check the size and the risk ✓ passed (28.8s)
md5: 3d10c9ab1d3e48dd14cb2ee3c8ed5332
Verify that the Result panel shows a position size of exactly 4.34 ETH, that the actual risk shown is exactly $99.78, and that the actual risk shown is not greater than the risk budget the page shows under the "Risk per trade" field. Store the displayed position size as displayed_size and the displayed actual risk as displayed_risk.

## Reset the fee ✓ passed (17.4s)
md5: fd70d33bec00636b42518a5d611d02ac
In the Account panel, clear the "Fee per side" field and type 0.
