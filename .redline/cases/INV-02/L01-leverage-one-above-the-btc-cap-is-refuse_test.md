---
mode: testing
url: http://localhost:5176
headless: true
---

## Enter the trade
In the Account panel, clear the "Account balance" field and type 10000. Clear the "Risk per trade" field and type 1. In the Position panel, click "BTC-PERP", then click "Long". Clear the "Leverage" field and type 51. Clear the "Entry price" field and type 60000. Clear the "Stop loss" field and type 59000.

## Check the leverage is refused, not clamped
Verify that the page shows the message "Max leverage for BTC-PERP is 50x", that the Result panel shows no position size, and that the "Leverage" field still shows 51.
