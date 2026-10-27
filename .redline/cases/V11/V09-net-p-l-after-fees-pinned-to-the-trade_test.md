---
mode: testing
url: http://localhost:5176
headless: true
---

## Enter and log the trade
In the Account panel, clear the "Account balance" field and type 10000. Clear the "Risk per trade" field and type 1. Clear the "Fee per side" field and type 0.05. In the Position panel, click "ETH-PERP", then click "Long". Clear the "Leverage" field and type 10. Clear the "Entry price" field and type 3000. Clear the "Stop loss" field and type 2930. Verify the Result panel shows a position size of exactly 1.37 ETH, then click "Log trade".

## Close the trade
In the Journal, find the open ETH-PERP Long trade you just logged with size 1.37. Enter 3140 as its exit price and close it.

## Check net P&L and R
Verify that this closed trade shows a realized P&L of +$187.59 and an R multiple of +1.88R. Store the displayed P&L as pnl_before and the displayed R multiple as r_before.

## Change the fee and check the trade did not change
In the Account panel, clear the "Fee per side" field and type 0. Verify that the same closed trade in the Journal still shows a realized P&L of +$187.59 and an R multiple of +1.88R.
