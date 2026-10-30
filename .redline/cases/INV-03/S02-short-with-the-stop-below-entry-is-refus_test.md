---
mode: testing
url: http://localhost:5176
headless: true
---

## Enter the trade
In the Account panel, clear the "Account balance" field and type 10000. Clear the "Risk per trade" field and type 1. In the Position panel, click "SOL-PERP", then click "Short". Clear the "Entry price" field and type 150. Clear the "Stop loss" field and type 145.

## Check it is refused
Verify that the page shows the message "Stop loss must be above entry for a short" and that the Result panel shows no position size.
