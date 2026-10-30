---
mode: testing
url: http://localhost:5176
headless: true
---

## Enter a valid BTC trade
In the Account panel, clear the "Account balance" field and type 10000. Clear the "Risk per trade" field and type 1. In the Position panel, click "BTC-PERP", then click "Long". Clear the "Leverage" field and type 30. Clear the "Entry price" field and type 60000. Clear the "Stop loss" field and type 59000. Verify that the Result panel shows a position size of 0.100 BTC.

## Switch instrument without touching leverage
In the Position panel, click "SOL-PERP". Clear the "Entry price" field and type 150. Clear the "Stop loss" field and type 140. Do not change the "Leverage" field.

## Check the cap of the new instrument applies
Verify that the page shows the message "Max leverage for SOL-PERP is 20x", that the Result panel shows no position size, and that the "Leverage" field still shows 30.
