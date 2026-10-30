---
mode: testing
url: http://localhost:5176
headless: true
---

## Start from an empty journal
Scroll to the Journal panel. If it lists any trades, delete each one, confirming each deletion, until it shows no trades.

## Log a trade
In the Account panel, clear the "Account balance" field and type 10000. Clear the "Risk per trade" field and type 1. In the Position panel, click "ETH-PERP", then click "Long". Clear the "Entry price" field and type 3000. Clear the "Stop loss" field and type 2930. Click "Log trade".

## Reload and check it is still there
Reload the page. Verify that the Journal lists an open ETH-PERP Long trade with size 1.42.

## Delete, reload and check it is gone
Delete that trade, confirming the deletion. Reload the page. Verify that the Journal no longer lists any ETH-PERP trade with size 1.42.
