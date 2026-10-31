---
test: ../P01-short-closed-below-entry-is-a-winner_test.md
status: passed
started: 2026-10-31T01:42:03.973Z
duration_s: 111
session_id: f48f5cd9-dec6-4c62-b0dd-488789f82be0
---

# P01-short-closed-below-entry-is-a-winner_test.md — Result

## Log the short ✓ passed (51.2s)
md5: 823663aac775129653d01010dbe8fdbd
In the Account panel, clear the "Account balance" field and type 10000. Clear the "Risk per trade" field and type 1. In the Position panel, click "SOL-PERP", then click "Short". Clear the "Entry price" field and type 150. Clear the "Stop loss" field and type 156. Verify the Result panel shows a position size of 16.6 SOL, then click "Log trade".

## Close it ✓ passed (24.4s)
md5: 9b9f17cfa73fc62b7b3090ee8281b2a9
In the Journal, find the open SOL-PERP Short trade with size 16.6. Enter 141 as its exit price and close it.

## Check the sign ✓ passed (14.2s)
md5: a5a9f3cc226abb03994606dd96d46d0c
Verify that this closed trade shows a realized P&L of +$149.40 and an R multiple of +1.50R.

## Clean up ✓ passed (18s)
md5: e2c2529e00650b4078661501f24d311f
Delete this trade from the Journal, confirming the deletion.
