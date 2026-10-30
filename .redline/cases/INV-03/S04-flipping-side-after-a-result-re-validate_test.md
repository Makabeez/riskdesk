---
mode: testing
url: http://localhost:5176
headless: true
---

## Enter a valid long
In the Account panel, clear the "Account balance" field and type 10000. Clear the "Risk per trade" field and type 1. In the Position panel, click "ETH-PERP", then click "Long". Clear the "Entry price" field and type 3000. Clear the "Stop loss" field and type 2930. Verify that the Result panel shows a position size of 1.42 ETH.

## Flip to short without touching the prices
In the Position panel, click "Short".

## Check the result is withdrawn
Verify that the page shows the message "Stop loss must be above entry for a short" and that the Result panel no longer shows a position size.
