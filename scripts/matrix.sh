#!/usr/bin/env bash
# Redline scoreboard: every adversarial case against every build, one build at a time.
# Each build gets its own port and its own copy of the cases (so recordings and credit
# costs never mix between builds) and its own ledger. Ends with REPORT.md.
#
#   bash scripts/matrix.sh                       # all builds that exist
#   bash scripts/matrix.sh haiku-oneshot opus-v11  # only these
#   nohup bash scripts/matrix.sh > ~/redline-matrix/matrix.log 2>&1 &   # overnight
set -u
[ -s "$HOME/.nvm/nvm.sh" ] && . "$HOME/.nvm/nvm.sh" >/dev/null
export PATH="$HOME/.npm-global/bin:$PATH"
RL=$HOME/kane-redline/bin/redline.mjs
SRC=$HOME/riskdesk/.redline/cases
M=$HOME/redline-matrix
INV="INV-01 INV-02 INV-03 INV-04 INV-05 INV-06"
# name | repo | port | suites      (opus-v11 last: its recordings become the judge path)
TARGETS=(
  "opus-oneshot|$HOME/riskdesk-baseline|5181|$INV"
  "sonnet-oneshot|$HOME/riskdesk-sonnet-oneshot|5183|$INV"
  "haiku-oneshot|$HOME/riskdesk-haiku-oneshot|5182|$INV"
  "haiku-gated-v11|$HOME/riskdesk-haiku-gated|5185|V11"
  "opus-v11|$HOME/riskdesk-v11-plain|5184|$INV V11"
)
stop_port() { local p; p=$(ss -ltnp "sport = :$1" 2>/dev/null | grep -oP 'pid=\K\d+' | head -1); [ -n "$p" ] && kill "$p"; }
mkdir -p "$M"
echo "matrix start $(date -Is) · $(kane-cli balance 2>/dev/null | grep -o 'Available credits.*')"
for t in "${TARGETS[@]}"; do
  IFS='|' read -r name repo port suites <<<"$t"
  if [ $# -gt 0 ] && [[ " $* " != *" $name "* ]]; then continue; fi
  [ -d "$repo" ] || { echo "== skip $name: $repo not found"; continue; }
  echo "== $name ($repo @ $(git -C "$repo" rev-parse --short HEAD)) on :$port · suites: $suites"
  mkdir -p "$M/$name/.redline"; rm -rf "$M/$name/.redline/cases"; cp -r "$SRC" "$M/$name/.redline/cases"
  find "$M/$name/.redline/cases" -name .testmuai -type d -prune -exec rm -rf {} +
  stop_port "$port"
  (cd "$repo" && nohup npm run dev -- --port "$port" --strictPort > "$M/$name/dev.log" 2>&1 &)
  for _ in $(seq 1 40); do curl -s -o /dev/null "http://localhost:$port" && break; sleep 1; done
  curl -s -o /dev/null "http://localhost:$port" || { echo "   dev server did not start, see $M/$name/dev.log"; continue; }
  for s in $suites; do
    node "$RL" run "$M/$name/.redline/cases/$s" --url "http://localhost:$port" --target "$name" \
      --max-credits 900 --ledger "$M/$name/ledger.ndjson" 2>&1 | grep -v '^    ·'
  done
  stop_port "$port"
done
node "$RL" report "$M"/*/ledger.ndjson > "$M/REPORT.md"
echo "matrix end $(date -Is) · $(kane-cli balance 2>/dev/null | grep -o 'Available credits.*')"
cat "$M/REPORT.md"
