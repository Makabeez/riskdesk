---
test: ../V07-xrp-below-the-minimum-of-10-not-the-lot-_test.md
status: passed
started: 2026-10-31T02:09:25.220Z
duration_s: 80
session_id: 50422565-4c6c-47c0-aea3-8c835561833d
---

# V07-xrp-below-the-minimum-of-10-not-the-lot-_test.md — Result

## Enter the trade ✓ passed (43.6s)
md5: 152e35526ffe91791d46166892849166
In the Account panel, clear the "Account balance" field and type 100. Clear the "Risk per trade" field and type 0.1. Clear the "Fee per side" field and type 0. In the Position panel, click "XRP-PERP", then click "Long". Clear the "Leverage" field and type 10. Clear the "Entry price" field and type 0.50. Clear the "Stop loss" field and type 0.48.

## Check that it is refused ✓ passed (25.6s)
md5: db9a126a4a34981616b72a5ca340e20c
Verify that the page shows the message "Position too small for minimum lot size", that the "Log trade" button is disabled and that the Result panel shows no position size. Store the displayed message as displayed_message.
