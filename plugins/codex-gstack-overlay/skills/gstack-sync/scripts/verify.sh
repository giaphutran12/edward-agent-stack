#!/usr/bin/env bash
set -euo pipefail

if ! command -v bun >/dev/null 2>&1; then
  echo "ERROR: bun not found on PATH" >&2
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

echo "Running skill health check"
bun run skill:check
