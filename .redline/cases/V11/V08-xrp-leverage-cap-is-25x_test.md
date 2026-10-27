---
mode: testing
url: http://localhost:5176
headless: true
---

## Enter the trade
In the Account panel, clear the "Account balance" field and type 10000. Clear the "Risk per trade" field and type 1. Clear the "Fee per side" field and type 0. In the Position panel, click "XRP-PERP", then click "Long". Clear the "Leverage" field and type 26. Clear the "Entry price" field and type 0.50. Clear the "Stop loss" field and type 0.48.

## Check that it is refused
Verify that the page shows the message "Max leverage for XRP-PERP is 25x" and that the Result panel shows no position size. Store the displayed message as displayed_message.

