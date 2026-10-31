---
test: ../R02-logged-trade-survives-reload-deleted-tra_test.md
status: passed
started: 2026-10-31T01:57:12.269Z
duration_s: 131
session_id: 61aa0ffd-6358-42ac-b981-b1cdd43abba7
---

# R02-logged-trade-survives-reload-deleted-tra_test.md — Result

## Start from an empty journal ✓ passed (32.6s)
md5: 05ce80b480dd269eee386dd33fd08beb
Scroll to the Journal panel. If it lists any trades, delete each one, confirming each deletion, until it shows no trades.

## Log a trade ✓ passed (26.2s)
md5: 9b0fdc20aa3d58bf957a30bb20ba9b3f
In the Account panel, clear the "Account balance" field and type 10000. Clear the "Risk per trade" field and type 1. In the Position panel, click "ETH-PERP", then click "Long". Clear the "Entry price" field and type 3000. Clear the "Stop loss" field and type 2930. Click "Log trade".

## Reload and check it is still there ✓ passed (26.1s)
md5: 443e430bf01ae532ae7626856a79474d
Reload the page. Verify that the Journal lists an open ETH-PERP Long trade with size 1.42.

## Delete, reload and check it is gone ✓ passed (42.8s)
md5: 003031a44c2a01f2b2e44f3b30f588bf
Delete that trade, confirming the deletion. Reload the page. Verify that the Journal no longer lists any ETH-PERP trade with size 1.42.
