#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="${1:-$ROOT/agents/AGENTS.md}"

tmp="$(mktemp)"
cleanup() { rm -f "$tmp"; }
trap cleanup EXIT

mkdir -p "$(dirname "$OUT")"

skill_files=()
if [ -f "$ROOT/skills/edward-rules/SKILL.md" ]; then
  skill_files+=("$ROOT/skills/edward-rules/SKILL.md")
fi
for skill_file in "$ROOT"/skills/*/SKILL.md; do
  [ "$skill_file" = "$ROOT/skills/edward-rules/SKILL.md" ] && continue
  skill_files+=("$skill_file")
done

{
  printf '<skills>\n\n'
  printf 'You have additional SKILLs documented in directories containing a `SKILL.md` file.\n\n'
  printf 'Use this file only as a fallback when the agent host cannot auto-discover skills.\n'
  printf 'If skills are installed normally, prefer the native skill loader.\n\n'
  printf 'These skills are:\n\n'

  for skill_file in "${skill_files[@]}"; do
    skill_dir="$(dirname "$skill_file")"
    skill_name="$(basename "$skill_dir")"
    rel_path="skills/$skill_name/SKILL.md"
    printf -- '- %s -> `%s`\n' "$skill_name" "$rel_path"
  done

  printf '\nIMPORTANT: You MUST read the matching `SKILL.md` whenever the skill description\n'
  printf 'matches the user intent or may help accomplish the task.\n\n'
  printf '<available_skills>\n\n'

  for skill_file in "${skill_files[@]}"; do
    skill_dir="$(dirname "$skill_file")"
    skill_name="$(basename "$skill_dir")"
    description="$(
      awk '
        /^---$/ { block++; next }
        block == 1 && /^description:[[:space:]]*/ {
          sub(/^description:[[:space:]]*/, "")
          gsub(/^"|"$/, "")
          print
          exit
        }
      ' "$skill_file"
    )"
    printf '%s: `%s`\n\n' "$skill_name" "$description"
  done

  printf '</available_skills>\n\n'
  printf 'Paths referenced inside skill folders are relative to that skill folder.\n\n'
  printf '</skills>\n'
} > "$tmp"

mv "$tmp" "$OUT"
trap - EXIT
