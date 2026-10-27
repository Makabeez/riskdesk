---
test: ../C10-log-trade-with-no-position-sized-ac-14_test.md
status: passed
started: 2026-10-27T21:20:17.606Z
duration_s: 96
session_id: 71c6fa42-64ec-40db-9b90-e4d639e667c2
---

# C10-log-trade-with-no-position-sized-ac-14_test.md — Result

## Count the journal before ✓ passed (32s)
md5: 7c354fa3a76c0ebb2943394caff6fd1f
Scroll to the Journal panel. Store the number of trade rows in the journal as rows_before (0 if it shows "No trades logged yet").

## Try to log without a position ✓ passed (37.7s)
md5: 27aec7f2c6845f37103f5478a7f3a943
In the Position panel, clear the "Entry price" field and the "Stop loss" field so both are empty. Click the "Log trade" button if it can be clicked.

## Check that nothing was logged ✓ passed (23.3s)
md5: b292cf93a69dc0fb506286b4e6c9a500
Verify that the number of trade rows in the Journal panel is still equal to rows_before, and that no new trade row appeared.
