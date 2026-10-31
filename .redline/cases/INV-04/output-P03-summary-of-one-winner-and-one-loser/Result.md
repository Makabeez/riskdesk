---
test: ../P03-summary-of-one-winner-and-one-loser_test.md
status: passed
started: 2026-10-31T01:46:26.709Z
duration_s: 236
session_id: a6ab5daf-9ef0-4f2a-8103-380caf02aa8c
---

# P03-summary-of-one-winner-and-one-loser_test.md — Result

## Start from an empty journal ✓ passed (41.7s)
md5: 05ce80b480dd269eee386dd33fd08beb
Scroll to the Journal panel. If it lists any trades, delete each one, confirming each deletion, until it shows no trades.

## Log the winning long ✓ passed (37.6s)
md5: dbe4e81b8b20be6ad65e2959406bae23
In the Account panel, clear the "Account balance" field and type 10000. Clear the "Risk per trade" field and type 1. In the Position panel, click "ETH-PERP", then click "Long". Clear the "Entry price" field and type 3000. Clear the "Stop loss" field and type 2930. Verify the Result panel shows a position size of 1.42 ETH, then click "Log trade".

## Close it ✓ passed (22.9s)
md5: a8b2333fedeb5d1f569e386319174eaf
In the Journal, find the open ETH-PERP Long trade with size 1.42. Enter 3140 as its exit price and close it.

## Log the losing short ✓ passed (55s)
md5: 823663aac775129653d01010dbe8fdbd
In the Account panel, clear the "Account balance" field and type 10000. Clear the "Risk per trade" field and type 1. In the Position panel, click "SOL-PERP", then click "Short". Clear the "Entry price" field and type 150. Clear the "Stop loss" field and type 156. Verify the Result panel shows a position size of 16.6 SOL, then click "Log trade".

## Close it ✓ passed (28s)
md5: ff8e641af7877c1a0b3d06c29cbf7fe9
In the Journal, find the open SOL-PERP Short trade with size 16.6. Enter 159 as its exit price and close it.

## Check the summary ✓ passed (15.5s)
md5: e5041e49d8d11eb299f14da4ae2a8590
Verify that the performance summary shows 2 closed trades, a win rate of 50%, a total realized P&L of +$49.40 and an average R of +0.25R.

## Clean up ✓ passed (32.1s)
md5: 54b7ad76094a6e370745fd921665a970
Delete both trades from the Journal, confirming each deletion.
