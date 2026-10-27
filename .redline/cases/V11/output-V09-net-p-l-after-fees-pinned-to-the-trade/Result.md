---
test: ../V09-net-p-l-after-fees-pinned-to-the-trade_test.md
status: passed
started: 2026-10-27T22:19:38.044Z
duration_s: 151
session_id: 7c3cf685-9736-4468-84ad-b8e158678da9
---

# V09-net-p-l-after-fees-pinned-to-the-trade_test.md — Result

## Enter and log the trade ✓ passed (65.4s)
md5: 9ccc81905ed7b16bfb9d529998e16620
In the Account panel, clear the "Account balance" field and type 10000. Clear the "Risk per trade" field and type 1. Clear the "Fee per side" field and type 0.05. In the Position panel, click "ETH-PERP", then click "Long". Clear the "Leverage" field and type 10. Clear the "Entry price" field and type 3000. Clear the "Stop loss" field and type 2930. Verify the Result panel shows a position size of exactly 1.37 ETH, then click "Log trade".

## Close the trade ✓ passed (33s)
md5: e96d1f64912fba1a1b65b8919f313201
In the Journal, find the open ETH-PERP Long trade you just logged with size 1.37. Enter 3140 as its exit price and close it.

## Check net P&L and R ✓ passed (24.1s)
md5: 26ff91524d24f2427d1821fb4276b4f4
Verify that this closed trade shows a realized P&L of +$187.59 and an R multiple of +1.88R. Store the displayed P&L as pnl_before and the displayed R multiple as r_before.

## Change the fee and check the trade did not change ✓ passed (25.6s)
md5: f24854d0541745f9b701433451c6a9a7
In the Account panel, clear the "Fee per side" field and type 0. Verify that the same closed trade in the Journal still shows a realized P&L of +$187.59 and an R multiple of +1.88R.
