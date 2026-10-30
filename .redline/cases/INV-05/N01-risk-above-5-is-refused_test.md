---
mode: testing
url: http://localhost:5176
headless: true
---

## Enter the trade
In the Account panel, clear the "Account balance" field and type 10000. Clear the "Risk per trade" field and type 5.1. In the Position panel, click "ETH-PERP", then click "Long". Clear the "Entry price" field and type 3000. Clear the "Stop loss" field and type 2930.

## Check it is refused
Verify that the page shows the message "Risk must be between 0.1% and 5%" and that the Result panel shows no position size. Verify that the texts "NaN", "Infinity" and "undefined" do not appear anywhere on the page.
