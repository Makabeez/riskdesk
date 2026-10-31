---
test: ../R01-account-settings-survive-a-reload_test.md
status: passed
started: 2026-10-31T01:55:55.226Z
duration_s: 63
session_id: aeb9532c-7c6c-454b-ba62-f331c84f0e07
---

# R01-account-settings-survive-a-reload_test.md — Result

## Change the settings ✓ passed (18.2s)
md5: fc485bd8d7582dcd70ff7399fd0ced0f
In the Account panel, clear the "Account balance" field and type 12500.50. Clear the "Risk per trade" field and type 2.

## Reload ✓ passed (10.8s)
md5: ca7cc3142af3f4f2aa218d84ceb4c7a1
Reload the page.

## Check they persisted ✓ passed (15.3s)
md5: 883e20024156f9618e5d5a0049f492a7
Verify that the "Account balance" field shows 12500.50 (written 12,500.50 or 12500.50) and the "Risk per trade" field shows 2.

## Restore the defaults ✓ passed (15.8s)
md5: 93cdb599e7f58f5404c5f941431fec60
Clear the "Account balance" field and type 10000. Clear the "Risk per trade" field and type 1.
