---
mode: testing
url: http://localhost:5176
headless: true
---

## Enter the trade
In the Account panel, clear the "Account balance" field and type 2500. Clear the "Risk per trade" field and type 0.3. In the Position panel, click "ETH-PERP", then click "Long". Clear the "Leverage" field and type 10. Clear the "Entry price" field and type 3000. Clear the "Stop loss" field and type 2999.7.

## Check the size and the risk
Verify that the Result panel shows a position size of exactly 25.00 ETH, that the actual risk shown is exactly $7.50, and that the actual risk shown is not greater than the risk budget the page shows under the "Risk per trade" field (balance 2500 multiplied by 0.3% is $7.50 rounded to the cent). Store the displayed position size as displayed_size and the displayed actual risk as displayed_risk.
