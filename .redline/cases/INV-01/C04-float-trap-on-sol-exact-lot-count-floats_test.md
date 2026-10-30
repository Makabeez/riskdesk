---
mode: testing
url: http://localhost:5176
headless: true
---

## Enter the trade
In the Account panel, clear the "Account balance" field and type 10000. Clear the "Risk per trade" field and type 0.3. In the Position panel, click "SOL-PERP", then click "Long". Clear the "Leverage" field and type 10. Clear the "Entry price" field and type 150. Clear the "Stop loss" field and type 149.7.

## Check the size and the risk
Verify that the Result panel shows a position size of exactly 100.0 SOL and that the actual risk shown is exactly $30.00. The risk budget here is 10000 multiplied by 0.3%, which is $30.00 to the cent: the actual risk shown must not be greater than that. Store the displayed position size as displayed_size and the displayed actual risk as displayed_risk.
