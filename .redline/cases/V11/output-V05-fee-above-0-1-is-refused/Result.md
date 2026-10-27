---
test: ../V05-fee-above-0-1-is-refused_test.md
status: passed
started: 2026-10-27T22:12:55.899Z
duration_s: 103
session_id: 62ffbf97-bfec-4408-b588-d6cc8d1c2a55
---

# V05-fee-above-0-1-is-refused_test.md — Result

## Enter the trade ✓ passed (49.8s)
md5: 3105389f43f189ff20139a00f6868e40
In the Account panel, clear the "Account balance" field and type 10000. Clear the "Risk per trade" field and type 1. Clear the "Fee per side" field and type 0.11. In the Position panel, click "ETH-PERP", then click "Long". Clear the "Leverage" field and type 10. Clear the "Entry price" field and type 3000. Clear the "Stop loss" field and type 2930.

## Check that it is refused ✓ passed (33s)
md5: 1cd5d95b83fe52a0939791124020daf7
Verify that the page shows the message "Fee must be between 0% and 0.1%" and that the Result panel shows no position size. Store the displayed message as displayed_message.

## Reset the fee ✓ passed (16.8s)
md5: fd70d33bec00636b42518a5d611d02ac
In the Account panel, clear the "Fee per side" field and type 0.
