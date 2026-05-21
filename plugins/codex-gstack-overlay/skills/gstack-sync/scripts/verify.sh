#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PLUGIN_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"

assert_contains() {
  local file="$1"
  local needle="$2"
  if ! grep -Fq "$needle" "$file"; then
    echo "ERROR: expected $file to contain: $needle" >&2
    exit 1
  fi
}

if ! command -v bun >/dev/null 2>&1; then
  echo "ERROR: bun not found on PATH" >&2
  exit 1
fi

if [ ! -f "$PLUGIN_ROOT/patches/0001-codex-default-gpt-5-5.patch" ]; then
  echo "ERROR: missing GPT-5.5 Codex overlay patch" >&2
  exit 1
fi

if [ ! -f "$PLUGIN_ROOT/patches/0002-codex-native-plan-review.patch" ]; then
  echo "ERROR: missing Codex-native plan review overlay patch" >&2
  exit 1
fi

echo "Verifying host generation"
bun run gen:skill-docs --host all

if [ -f ship/SKILL.md ] && [ -f test/fixtures/golden/claude-ship-SKILL.md ]; then
  echo "Refreshing generated ship golden fixtures"
  cp ship/SKILL.md test/fixtures/golden/claude-ship-SKILL.md
  cp .agents/skills/gstack-ship/SKILL.md test/fixtures/golden/codex-ship-SKILL.md
  cp .factory/skills/gstack-ship/SKILL.md test/fixtures/golden/factory-ship-SKILL.md
fi

echo "Validating host config"
bun run scripts/host-config-export.ts validate

echo "Running focused tests"
bun test test/host-config.test.ts test/codex-hardening.test.ts

echo "Checking Codex plan-review overlay invariants"
codex_plan_skill=".agents/skills/gstack-plan-eng-review/SKILL.md"
assert_contains "$codex_plan_skill" "MODEL_OVERLAY: gpt-5.5"
assert_contains "$codex_plan_skill" "Codex decision gate"
assert_contains "$codex_plan_skill" "request_user_input"
assert_contains "$codex_plan_skill" "BLOCKED — Codex decision gate unavailable"
assert_contains "$codex_plan_skill" "Outside Voice — Independent Plan Challenge (Codex-native"
assert_contains "$codex_plan_skill" "Codex subagent"
assert_contains "$codex_plan_skill" "inline fallback"
assert_contains "$codex_plan_skill" "expected path/test matrix"
assert_contains "$codex_plan_skill" "Do not invent exact filenames, functions, or branch coverage before code exists"
assert_contains "$codex_plan_skill" "Skip the offer for obvious"
assert_contains "$codex_plan_skill" "bugs, mechanical refactors"

if grep -Fq "BLOCKED — AskUserQuestion unavailable" "$codex_plan_skill"; then
  echo "ERROR: Codex plan review still contains Claude-only AUQ unavailable wording" >&2
  exit 1
fi

echo "Running skill health check"
bun run skill:check
