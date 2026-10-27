---
mode: testing
url: http://localhost:5176
headless: true
---

## Count the journal before
Scroll to the Journal panel. Store the number of trade rows in the journal as rows_before (0 if it shows "No trades logged yet").

## Try to log without a position
In the Position panel, clear the "Entry price" field and the "Stop loss" field so both are empty. Click the "Log trade" button if it can be clicked.

## Check that nothing was logged
Verify that the number of trade rows in the Journal panel is still equal to rows_before, and that no new trade row appeared.
