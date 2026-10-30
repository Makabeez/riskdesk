---
mode: testing
url: http://localhost:5176
headless: true
---

## Start from an empty journal
Scroll to the Journal panel. If it lists any trades, delete each one, confirming each deletion, until it shows no trades.

## Log the winning long
In the Account panel, clear the "Account balance" field and type 10000. Clear the "Risk per trade" field and type 1. In the Position panel, click "ETH-PERP", then click "Long". Clear the "Entry price" field and type 3000. Clear the "Stop loss" field and type 2930. Verify the Result panel shows a position size of 1.42 ETH, then click "Log trade".

## Close it
In the Journal, find the open ETH-PERP Long trade with size 1.42. Enter 3140 as its exit price and close it.

## Log the losing short
In the Account panel, clear the "Account balance" field and type 10000. Clear the "Risk per trade" field and type 1. In the Position panel, click "SOL-PERP", then click "Short". Clear the "Entry price" field and type 150. Clear the "Stop loss" field and type 156. Verify the Result panel shows a position size of 16.6 SOL, then click "Log trade".

## Close it
In the Journal, find the open SOL-PERP Short trade with size 16.6. Enter 159 as its exit price and close it.

## Check the summary
Verify that the performance summary shows 2 closed trades, a win rate of 50%, a total realized P&L of +$49.40 and an average R of +0.25R.

## Clean up
Delete both trades from the Journal, confirming each deletion.
