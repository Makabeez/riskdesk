---
mode: testing
url: http://localhost:5176
headless: true
---

## Log the short
In the Account panel, clear the "Account balance" field and type 10000. Clear the "Risk per trade" field and type 1. In the Position panel, click "SOL-PERP", then click "Short". Clear the "Entry price" field and type 150. Clear the "Stop loss" field and type 156. Verify the Result panel shows a position size of 16.6 SOL, then click "Log trade".

## Close it
In the Journal, find the open SOL-PERP Short trade with size 16.6. Enter 141 as its exit price and close it.

## Check the sign
Verify that this closed trade shows a realized P&L of +$149.40 and an R multiple of +1.50R.

## Clean up
Delete this trade from the Journal, confirming the deletion.
