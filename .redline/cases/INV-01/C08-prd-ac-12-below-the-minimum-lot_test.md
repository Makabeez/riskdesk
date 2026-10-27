---
mode: testing
url: http://localhost:5176
headless: true
---

## Enter the trade
In the Account panel, clear the "Account balance" field and type 100. Clear the "Risk per trade" field and type 0.1. In the Position panel, click "ETH-PERP", then click "Long". Clear the "Leverage" field and type 10. Clear the "Entry price" field and type 3000. Clear the "Stop loss" field and type 2000.

## Check that the trade cannot be logged
Verify that the page shows the message "Position too small for minimum lot size" and that the "Log trade" button is disabled and cannot be clicked. Store the displayed message as displayed_message.
