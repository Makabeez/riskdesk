---
test: ../V05-fee-above-0-1-is-refused_test.md
status: passed
started: 2026-10-31T02:06:19.947Z
duration_s: 94
session_id: a699430b-44f7-4c09-bc83-a6d2624642b8
---

# V05-fee-above-0-1-is-refused_test.md — Result

## Enter the trade ✓ passed (45.8s)
md5: 3105389f43f189ff20139a00f6868e40
In the Account panel, clear the "Account balance" field and type 10000. Clear the "Risk per trade" field and type 1. Clear the "Fee per side" field and type 0.11. In the Position panel, click "ETH-PERP", then click "Long". Clear the "Leverage" field and type 10. Clear the "Entry price" field and type 3000. Clear the "Stop loss" field and type 2930.

## Check that it is refused ✓ passed (22.6s)
md5: 1cd5d95b83fe52a0939791124020daf7
Verify that the page shows the message "Fee must be between 0% and 0.1%" and that the Result panel shows no position size. Store the displayed message as displayed_message.

## Reset the fee ✓ passed (13.5s)
md5: fd70d33bec00636b42518a5d611d02ac
In the Account panel, clear the "Fee per side" field and type 0.
