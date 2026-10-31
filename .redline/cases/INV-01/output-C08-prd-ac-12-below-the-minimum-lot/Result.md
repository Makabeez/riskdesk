---
test: ../C08-prd-ac-12-below-the-minimum-lot_test.md
status: passed
started: 2026-10-31T01:27:56.479Z
duration_s: 71
session_id: 9f58050d-06d2-4976-9a36-97e943dbe28c
---

# C08-prd-ac-12-below-the-minimum-lot_test.md — Result

## Enter the trade ✓ passed (34.4s)
md5: e94656ab1817557e23907f08017e848b
In the Account panel, clear the "Account balance" field and type 100. Clear the "Risk per trade" field and type 0.1. In the Position panel, click "ETH-PERP", then click "Long". Clear the "Leverage" field and type 10. Clear the "Entry price" field and type 3000. Clear the "Stop loss" field and type 2000.

## Check that the trade cannot be logged ✓ passed (24.6s)
md5: 3b371966485a7acb8024914f0515b69f
Verify that the page shows the message "Position too small for minimum lot size" and that the "Log trade" button is disabled and cannot be clicked. Store the displayed message as displayed_message.
