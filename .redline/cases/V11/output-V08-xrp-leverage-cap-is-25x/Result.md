---
test: ../V08-xrp-leverage-cap-is-25x_test.md
status: passed
started: 2026-10-31T02:10:51.618Z
duration_s: 75
session_id: 7cc2635d-6cea-49ee-a1b4-a3d84cd36bb1
---

# V08-xrp-leverage-cap-is-25x_test.md — Result

## Enter the trade ✓ passed (38s)
md5: f84264379fa6e1203379f0a9e40fc08d
In the Account panel, clear the "Account balance" field and type 10000. Clear the "Risk per trade" field and type 1. Clear the "Fee per side" field and type 0. In the Position panel, click "XRP-PERP", then click "Long". Clear the "Leverage" field and type 26. Clear the "Entry price" field and type 0.50. Clear the "Stop loss" field and type 0.48.

## Check that it is refused ✓ passed (26s)
md5: f959a5d9fcf41b0fd498053b1d78f01a
Verify that the page shows the message "Max leverage for XRP-PERP is 25x" and that the Result panel shows no position size. Store the displayed message as displayed_message.
