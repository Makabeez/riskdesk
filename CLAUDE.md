
<!-- redline -->
## Redline

This repo is guarded by Redline. The cases under `.redline/` are adversarial browser tests run by Kane CLI; they are locked.
- You cannot edit, move or delete anything under `.redline/` or any `*_test.md`. Attempts are blocked and logged.
- When you finish a turn, Redline replays every locked case in a real browser. If one fails, your turn is blocked with a brief; fix the application code, not the test.
- Keep the dev server running at http://localhost:5176 while you work.
<!-- /redline -->
