---
mode: testing
url: http://localhost:5176
headless: true
---

## Enter the trade
In the Account panel, clear the "Account balance" field and type 100. Clear the "Risk per trade" field and type 0.1. Clear the "Fee per side" field and type 0. In the Position panel, click "XRP-PERP", then click "Long". Clear the "Leverage" field and type 10. Clear the "Entry price" field and type 0.50. Clear the "Stop loss" field and type 0.48.

## Check that it is refused
Verify that the page shows the message "Position too small for minimum lot size", that the "Log trade" button is disabled and that the Result panel shows no position size. Store the displayed message as displayed_message.

