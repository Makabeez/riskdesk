---
mode: testing
url: http://localhost:5176
headless: true
---

## Enter the trade
In the Account panel, clear the "Account balance" field and type 10000.75. Clear the "Risk per trade" field and type 1. In the Position panel, click "ETH-PERP", then click "Long". Clear the "Leverage" field and type 10. Clear the "Entry price" field and type 3000. Clear the "Stop loss" field and type 2944.13.

## Check the size and the risk
Verify that the Result panel shows a position size of exactly 1.79 ETH and that the actual risk shown is at most $100.01. The risk budget here is 10000.75 multiplied by 1%, which is $100.01 to the cent: the actual risk shown must not be greater than that. Store the displayed position size as displayed_size and the displayed actual risk as displayed_risk.
