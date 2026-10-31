---
test: ../S02-short-with-the-stop-below-entry-is-refus_test.md
status: passed
started: 2026-10-31T01:37:54.895Z
duration_s: 70
session_id: c61c8648-ca74-4d61-b185-4e041f97c503
---

# S02-short-with-the-stop-below-entry-is-refus_test.md — Result

## Enter the trade ✓ passed (44.6s)
md5: 35ba2e6228ce19afd9f8b454dcdf694f
In the Account panel, clear the "Account balance" field and type 10000. Clear the "Risk per trade" field and type 1. In the Position panel, click "SOL-PERP", then click "Short". Clear the "Entry price" field and type 150. Clear the "Stop loss" field and type 145.

## Check it is refused ✓ passed (21.7s)
md5: 8190328977beca880ff77d35d6d52e5b
Verify that the page shows the message "Stop loss must be above entry for a short" and that the Result panel shows no position size.
