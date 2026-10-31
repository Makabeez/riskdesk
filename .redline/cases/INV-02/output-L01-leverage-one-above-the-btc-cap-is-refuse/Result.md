---
test: ../L01-leverage-one-above-the-btc-cap-is-refuse_test.md
status: passed
started: 2026-10-31T01:32:09.564Z
duration_s: 65
session_id: 25f63f56-ae47-48f6-a138-f547381238c1
---

# L01-leverage-one-above-the-btc-cap-is-refuse_test.md — Result

## Enter the trade ✓ passed (37.8s)
md5: 13424553a65ec1b98033bbc08ef64633
In the Account panel, clear the "Account balance" field and type 10000. Clear the "Risk per trade" field and type 1. In the Position panel, click "BTC-PERP", then click "Long". Clear the "Leverage" field and type 51. Clear the "Entry price" field and type 60000. Clear the "Stop loss" field and type 59000.

## Check the leverage is refused, not clamped ✓ passed (24.3s)
md5: 24c00f5f5987bc42174a77c1df66a4d1
Verify that the page shows the message "Max leverage for BTC-PERP is 50x", that the Result panel shows no position size, and that the "Leverage" field still shows 51.
