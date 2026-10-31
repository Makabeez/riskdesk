# RiskDesk: the evidence repo for [Redline](https://github.com/Makabeez/kane-redline)

> A position-size calculator and trade journal whose whole job is to never show a risk above your limit. Three Claude models built it from one PRD; Redline and Kane CLI attacked every build in a real browser. This repo holds the app, the PRD, every adversarial case, every ledger line, and every agent's full commit history.

**Live app:** https://riskdesk-omega.vercel.app · **Video:** {{VIDEO_URL}} · **Kit:** [Makabeez/kane-redline](https://github.com/Makabeez/kane-redline)

## Judge path (one command, after `kane-cli login`)

```bash
git clone https://github.com/Makabeez/riskdesk && cd riskdesk && npm ci
npm run dev -- --port 5184 &          # the port the committed recordings were authored on
npx -y github:Makabeez/kane-redline run .redline/cases --url http://localhost:5184 --target judge --max-credits 60
```

All 34 cases are committed with Kane's recordings for this exact app, so they replay instead of re-authoring: about 0 credits and ~16 s per case. Then `npx -y github:Makabeez/kane-redline report` prints the scoreboard, your run included.

## What's where

| Path | What |
|---|---|
| `src/`, `index.html` | The shipped app: Opus one-shot, then change request v1.1 by a plain Opus session. Exact decimal arithmetic (`src/lib/decimal.ts`) |
| `docs/prd.md`, `docs/prd-v1.1-change-request.md` | The spec every agent got (also copied to the root as `PRD.md` / `CHANGE-REQUEST.md`, as the agents saw them) |
| `.redline/invariants.yml` | The 7 money invariants, mapped to the PRD's acceptance criteria |
| `.redline/gen/` | Case generators. `exact.mjs` is BigInt-fraction arithmetic of PRD §5 plus fees; it also computes what naive float code would show |
| `.redline/cases/INV-01..06`, `V11` | 34 Kane `_test.md` cases with `cases.json` (inputs, expected display, why the case exists) and Kane's recordings |
| `.redline/ledger.ndjson` | Every Kane run of the build week before the matrix, including the failed spike and the first Haiku catch |
| `matrix/<build>/ledger.ndjson`, `matrix/REPORT.md` | The scoreboard: every case against every build |
| `scripts/matrix.sh` | Reproduces the scoreboard (each build on its own port, its own case copy, its own ledger) |

## Every agent's work, untouched

Each build is a branch with the agent's original commits and timestamps:

| Branch | Model | Prompt | Result |
|---|---|---|---|
| `exp/opus-oneshot` | Opus | "Build the web app specified in PRD.md…" | 25/25 held |
| `exp/sonnet-oneshot` | Sonnet 5.5 | same | **C04, C05 broken** (99.9 SOL, 24.99 ETH); P01–P03 false positives, see below |
| `exp/haiku-oneshot` | Haiku 5.5 | same | **C04, C05 broken** |
| `exp/opus-v11` | Opus | "Implement the change request in CHANGE-REQUEST.md…" | 34/34 held (this is `main`'s app) |
| `exp/haiku-v11-plain` | Haiku 5.5 | same, on Opus's codebase | 19/19 held: Opus's exact-decimal core left no room for a float bug |
| `exp/haiku-gated-v11` | Haiku 5.5 | same, on **its own** buggy build, behind the Redline gate | gate blocked on C05, agent fixed it, 3/3 then 9/9 held |

Two notes on fidelity. Sonnet committed `node_modules` because it never wrote a `.gitignore`; that directory was stripped from its branch with `git filter-branch`, keeping every date and message. And the matrix log names Sonnet's build `@ cdcc9b1` because the run started a few minutes before the build was committed; the code served was the working tree that became `ef9ac6a` (`a3b0201` after the strip).

## Sonnet P01–P03 are not bugs

Kane reported `740 confirmed_product_bug` twice on each, all on the cleanup step: "the trade stays in the Journal after its deletion is confirmed". Sonnet's delete (`src/components/Journal.tsx:53`) is `if (window.confirm('Delete this trade?')) onDelete(id)`, and `onDelete` filters and saves correctly. A headless Kane run can't accept a native browser dialog, so it is dismissed and nothing happens. Opus and Haiku built in-page dialogs, which Kane clicks normally. The P&L checks themselves passed before the cleanup step. Full list of Redline's own mistakes: [kane-redline § Redline was wrong here](https://github.com/Makabeez/kane-redline#redline-was-wrong-here).

## Run the app

```bash
npm ci && npm run dev      # http://localhost:5176
npm test                   # the agent's own unit tests (vitest)
```
