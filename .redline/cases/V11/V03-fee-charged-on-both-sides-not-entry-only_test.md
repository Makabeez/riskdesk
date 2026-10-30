---
mode: testing
url: http://localhost:5176
headless: true
---

## Enter the trade
In the Account panel, clear the "Account balance" field and type 10000. Clear the "Risk per trade" field and type 1. Clear the "Fee per side" field and type 0.05. In the Position panel, click "ETH-PERP", then click "Long". Clear the "Leverage" field and type 10. Clear the "Entry price" field and type 3000. Clear the "Stop loss" field and type 2980.

## Check the size and the risk
Verify that the Result panel shows a position size of exactly 4.34 ETH, that the actual risk shown is exactly $99.78, which is within the $100.00 risk budget (balance 10000 multiplied by 1%). Store the displayed position size as displayed_size and the displayed actual risk as displayed_risk.

## Reset the fee
In the Account panel, clear the "Fee per side" field and type 0.
