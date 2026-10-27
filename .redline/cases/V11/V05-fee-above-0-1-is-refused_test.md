---
mode: testing
url: http://localhost:5176
headless: true
---

## Enter the trade
In the Account panel, clear the "Account balance" field and type 10000. Clear the "Risk per trade" field and type 1. Clear the "Fee per side" field and type 0.11. In the Position panel, click "ETH-PERP", then click "Long". Clear the "Leverage" field and type 10. Clear the "Entry price" field and type 3000. Clear the "Stop loss" field and type 2930.

## Check that it is refused
Verify that the page shows the message "Fee must be between 0% and 0.1%" and that the Result panel shows no position size. Store the displayed message as displayed_message.

## Reset the fee
In the Account panel, clear the "Fee per side" field and type 0.
