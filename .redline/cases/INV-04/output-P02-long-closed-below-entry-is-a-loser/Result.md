---
test: ../P02-long-closed-below-entry-is-a-loser_test.md
status: passed
started: 2026-10-31T01:44:09.287Z
duration_s: 124
session_id: 6e72e7fa-826d-4831-a512-2a1644c56fe0
---

# P02-long-closed-below-entry-is-a-loser_test.md — Result

## Log the long ✓ passed (57.1s)
md5: dbe4e81b8b20be6ad65e2959406bae23
In the Account panel, clear the "Account balance" field and type 10000. Clear the "Risk per trade" field and type 1. In the Position panel, click "ETH-PERP", then click "Long". Clear the "Entry price" field and type 3000. Clear the "Stop loss" field and type 2930. Verify the Result panel shows a position size of 1.42 ETH, then click "Log trade".

## Close it ✓ passed (25.8s)
md5: 8c43e71c5276a5b3d5ff40b2aff11347
In the Journal, find the open ETH-PERP Long trade with size 1.42. Enter 2965 as its exit price and close it.

## Check the sign ✓ passed (18.7s)
md5: 2559c58197e3be9e00c83385d27c026d
Verify that this closed trade shows a realized P&L of −$49.70 and an R multiple of −0.50R, both negative.

## Clean up ✓ passed (18.5s)
md5: e2c2529e00650b4078661501f24d311f
Delete this trade from the Journal, confirming the deletion.
