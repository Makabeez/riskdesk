---
test: ../V03-fee-charged-on-both-sides-not-entry-only_test.md
status: passed
started: 2026-10-31T02:02:53.632Z
duration_s: 91
session_id: c4edaf82-7f2d-4ddf-bd16-fe713fba69b5
---

# V03-fee-charged-on-both-sides-not-entry-only_test.md — Result

## Enter the trade ✓ passed (42.9s)
md5: 80017f6e9b10621e89a6b95abc43ad84
In the Account panel, clear the "Account balance" field and type 10000. Clear the "Risk per trade" field and type 1. Clear the "Fee per side" field and type 0.05. In the Position panel, click "ETH-PERP", then click "Long". Clear the "Leverage" field and type 10. Clear the "Entry price" field and type 3000. Clear the "Stop loss" field and type 2980.

## Check the size and the risk ✓ passed (23.5s)
md5: f8109144c46dccf4d92a9a5505b4721d
Verify that the Result panel shows a position size of exactly 4.34 ETH, that the actual risk shown is exactly $99.78, which is within the $100.00 risk budget (balance 10000 multiplied by 1%). Store the displayed position size as displayed_size and the displayed actual risk as displayed_risk.

## Reset the fee ✓ passed (14.2s)
md5: fd70d33bec00636b42518a5d611d02ac
In the Account panel, clear the "Fee per side" field and type 0.
