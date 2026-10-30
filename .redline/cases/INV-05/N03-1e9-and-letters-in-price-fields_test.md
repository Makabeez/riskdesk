---
mode: testing
url: http://localhost:5176
headless: true
---

## Enter an absurd entry
In the Account panel, clear the "Account balance" field and type 10000. Clear the "Risk per trade" field and type 1. In the Position panel, click "ETH-PERP", then click "Long". Clear the "Entry price" field and type 1e9. Clear the "Stop loss" field and type 2930.

## Check it is refused
Verify that an error is shown next to the "Entry price" field and that the Result panel shows no position size. Verify that the texts "NaN", "Infinity" and "undefined" do not appear anywhere on the page.

## Enter letters as the stop
Clear the "Entry price" field and type 3000. Clear the "Stop loss" field and type abc.

## Check it is refused
Verify that an error is shown next to the "Stop loss" field, that the Result panel shows no position size, and that the page has not gone blank. Verify that the texts "NaN", "Infinity" and "undefined" do not appear anywhere on the page.
