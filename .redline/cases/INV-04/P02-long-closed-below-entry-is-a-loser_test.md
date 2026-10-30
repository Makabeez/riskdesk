---
mode: testing
url: http://localhost:5176
headless: true
---

## Log the long
In the Account panel, clear the "Account balance" field and type 10000. Clear the "Risk per trade" field and type 1. In the Position panel, click "ETH-PERP", then click "Long". Clear the "Entry price" field and type 3000. Clear the "Stop loss" field and type 2930. Verify the Result panel shows a position size of 1.42 ETH, then click "Log trade".

## Close it
In the Journal, find the open ETH-PERP Long trade with size 1.42. Enter 2965 as its exit price and close it.

## Check the sign
Verify that this closed trade shows a realized P&L of −$49.70 and an R multiple of −0.50R, both negative.

## Clean up
Delete this trade from the Journal, confirming the deletion.
