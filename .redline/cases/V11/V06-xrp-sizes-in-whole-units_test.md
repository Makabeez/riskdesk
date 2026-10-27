---
mode: testing
url: http://localhost:5176
headless: true
---

## Enter the trade
In the Account panel, clear the "Account balance" field and type 10000. Clear the "Risk per trade" field and type 1. Clear the "Fee per side" field and type 0. In the Position panel, click "XRP-PERP", then click "Long". Clear the "Leverage" field and type 10. Clear the "Entry price" field and type 0.50. Clear the "Stop loss" field and type 0.48.

## Check the size and the risk
Verify that the Result panel shows a position size of exactly 5,000 XRP (written 5,000 or 5000), that the actual risk shown is exactly $100.00, and that the actual risk shown is not greater than the risk budget the page shows under the "Risk per trade" field. Store the displayed position size as displayed_size and the displayed actual risk as displayed_risk.

