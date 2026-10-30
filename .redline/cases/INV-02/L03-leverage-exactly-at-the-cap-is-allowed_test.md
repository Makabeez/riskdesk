---
mode: testing
url: http://localhost:5176
headless: true
---

## Enter the trade
In the Account panel, clear the "Account balance" field and type 10000. Clear the "Risk per trade" field and type 1. In the Position panel, click "ETH-PERP", then click "Long". Clear the "Leverage" field and type 50. Clear the "Entry price" field and type 3000. Clear the "Stop loss" field and type 2930.

## Check the cap itself is accepted
Verify that no leverage error is shown, that the Result panel shows a position size of 1.42 ETH, and that the margin required shown is $85.20.
