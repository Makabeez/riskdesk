---
test: ../S03-stop-equal-to-entry-is-refused_test.md
status: passed
started: 2026-10-31T01:39:18.410Z
duration_s: 66
session_id: 724bdf77-f5de-4bea-93e0-4d92dc55ee1b
---

# S03-stop-equal-to-entry-is-refused_test.md — Result

## Enter the trade ✓ passed (35.9s)
md5: a1db8557166228936d52d2e095142429
In the Account panel, clear the "Account balance" field and type 10000. Clear the "Risk per trade" field and type 1. In the Position panel, click "ETH-PERP", then click "Long". Clear the "Entry price" field and type 3000. Clear the "Stop loss" field and type 3000.

## Check it is refused ✓ passed (26.7s)
md5: a47c2180ef2bd1715f33f028b69ee43f
Verify that the page shows the message "Stop loss must be below entry for a long" and that the Result panel shows no position size. Verify that the texts "NaN", "Infinity" and "undefined" do not appear anywhere on the page.
