---
test: ../S01-long-with-the-stop-above-entry-is-refuse_test.md
status: passed
started: 2026-10-31T01:36:30.825Z
duration_s: 70
session_id: 6936d8c8-73a0-4b77-9fc4-7063cfe0c006
---

# S01-long-with-the-stop-above-entry-is-refuse_test.md — Result

## Enter the trade ✓ passed (46.9s)
md5: 6f3b5273d860ed1534b68e478538ff9e
In the Account panel, clear the "Account balance" field and type 10000. Clear the "Risk per trade" field and type 1. In the Position panel, click "ETH-PERP", then click "Long". Clear the "Entry price" field and type 3000. Clear the "Stop loss" field and type 3050.

## Check it is refused ✓ passed (19.7s)
md5: 3927dd642263352dfb4bdbaa554cc3fe
Verify that the page shows the message "Stop loss must be below entry for a long" and that the Result panel shows no position size.
