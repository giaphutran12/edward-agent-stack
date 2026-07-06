#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

command -v rg >/dev/null 2>&1 || {
  printf 'FAIL operator playbook audit: ripgrep (rg) is required. Install with: brew install ripgrep\n'
  exit 1
}

encoded_patterns=(
  "cHJpdmF0ZSBwZXJzb25hbA=="
  "bWVtb3J5IGR1bXA="
  "dHJhdW1h"
  "cmFtYmw="
  "YmFjayBhbmQgZm9ydGg="
  "bm90IHN1cmU="
  "aSBkb24ndA=="
  "Yml0d2FyZGVu"
  "cGFzc3dvcmQgbWFuYWdlcg=="
  "c2xhY2stcGFzdGluZw=="
  "cmF3IGtleQ=="
  "cHVibGljLXNhZmU="
  "b3BlcmF0aW5nIHN5c3RlbQ=="
  "c3R1cGlk"
  "Y2hhb3M="
  "ZG9jdW1lbnRhcnk="
  "aGVhZCBzY3JhdGNoaW5n"
  "Y29uc3RydWN0aW9u"
  "d2hhdCB0aGlzIGRvZXMgbm90"
  "ZG9lcyBub3Qgc29sdmU="
  "cmVzZWFyY2ggaGlzdG9yeQ=="
  "aW50ZXJuYWwgZGViYXRl"
  "bWV0YS1jb21tZW50YXJ5"
  "dHJhbnNjcmlwdA=="
  "ZGlzY292ZXJlZA=="
  "cmV3cml0dGVu"
  "ZGViYXRlZA=="
  "Y2xlYW5lZCB1cA=="
  "YnJhaW4tZHVtcA=="
)

decode_b64() {
  if printf 'YQ==' | base64 --decode >/dev/null 2>&1; then
    base64 --decode
  else
    base64 -D
  fi
}

patterns=()
for encoded in "${encoded_patterns[@]}"; do
  patterns+=("$(printf '%s' "$encoded" | decode_b64)")
done

joined="$(IFS='|'; printf '%s' "${patterns[*]}")"

if rg -n -i --no-ignore "$joined" \
  --glob '!*.pdf' \
  --glob '!*.png' \
  --glob '!scripts/audit-operator-playbook.sh' \
  --glob '!assessments/**' \
  --glob '!.git/*' \
  --glob '!.repowise/*' \
  --glob '!.omx/*' \
  --glob '!.gstack/*' \
  "$ROOT"; then
  printf '\nFAIL operator playbook audit: remove process/history residue from agent/intern-facing material.\n'
  printf 'Write final standards only: problem, standard, reason, procedure.\n'
  exit 1
fi

printf 'OK   operator playbook audit\n'
