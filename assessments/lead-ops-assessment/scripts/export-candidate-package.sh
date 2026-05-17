#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
ASSESSMENT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd -P)"
DEFAULT_OUTPUT_PARENT="${ASSESSMENT_ROOT}/tmp/candidate-exports"
OUTPUT_PARENT="${1:-${DEFAULT_OUTPUT_PARENT}}"

case "${OUTPUT_PARENT}" in
  /*) ;;
  *) OUTPUT_PARENT="${ASSESSMENT_ROOT}/${OUTPUT_PARENT}" ;;
esac

timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
package_name="lead-ops-assessment-candidate-${timestamp}"
export_dir="${OUTPUT_PARENT}/${package_name}"
counter=0

while [ -e "${export_dir}" ]; do
  counter=$((counter + 1))
  export_dir="${OUTPUT_PARENT}/${package_name}-${counter}"
done

die() {
  printf 'Export failed: %s\n' "$1" >&2
  exit 1
}

copy_file() {
  local relative_path="$1"
  local source_path="${ASSESSMENT_ROOT}/${relative_path}"
  local target_path="${export_dir}/${relative_path}"

  [ -f "${source_path}" ] || die "missing required file ${relative_path}"
  mkdir -p "$(dirname "${target_path}")"
  cp "${source_path}" "${target_path}"
}

copy_dir() {
  local relative_path="$1"
  local source_path="${ASSESSMENT_ROOT}/${relative_path}"
  local target_path="${export_dir}/${relative_path}"

  [ -d "${source_path}" ] || die "missing required directory ${relative_path}"
  mkdir -p "$(dirname "${target_path}")"
  cp -R "${source_path}" "${target_path}"
}

mkdir -p "${export_dir}"

candidate_files=(
  ".env.example"
  "AI_USAGE.md"
  "ASSESSMENT.md"
  "BUG_TRIAGE.md"
  "README.md"
  "index.html"
  "package-lock.json"
  "package.json"
  "tsconfig.json"
  "vite.config.ts"
  "vitest.config.ts"
  "docs/RUNBOOK.md"
  "scripts/reset-demo-state.mjs"
  "tests/setup.ts"
)

candidate_dirs=(
  ".devcontainer"
  "assignment"
  "fixtures"
  "incident"
  "public"
  "review"
  "src"
  "tests/public"
)

for relative_path in "${candidate_files[@]}"; do
  copy_file "${relative_path}"
done

for relative_path in "${candidate_dirs[@]}"; do
  copy_dir "${relative_path}"
done

cat > "${export_dir}/.gitignore" <<'GITIGNORE'
.DS_Store
.env
.env.*
!.env.example
node_modules/
dist/
coverage/
tmp/
GITIGNORE

node --input-type=module - "${export_dir}/package.json" <<'NODE'
import { readFileSync, writeFileSync } from "node:fs";

const packagePath = process.argv[2];
const packageJson = JSON.parse(readFileSync(packagePath, "utf8"));

for (const scriptName of Object.keys(packageJson.scripts ?? {})) {
  if (scriptName === "test:hidden" || scriptName.startsWith("reviewer:")) {
    delete packageJson.scripts[scriptName];
  }
}

writeFileSync(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);
NODE

for forbidden_path in \
  "docs/SPEC.md" \
  "docs/ARCHITECTURE.md" \
  "docs/EXPORT_POLICY.md" \
  "docs/CANDIDATE_REPO_RUNBOOK.md" \
  "docs/READINESS_REPORT.md" \
  "reviewer" \
  "scripts/export-candidate-package.sh" \
  "scripts/verify-candidate-export.sh" \
  "scripts/verify-hidden-tests.mjs" \
  "scripts/verify-answer-key.mjs" \
  "scripts/check-intern-a.mjs" \
  "scripts/check-intern-b.mjs"; do
  if [ -e "${export_dir}/${forbidden_path}" ]; then
    die "copied reviewer-only path ${forbidden_path}"
  fi
done

hidden_hits="$(find "${export_dir}" \( -name '*hidden*' -o -name 'ANSWER_KEY.md' -o -name 'SCORING_RUBRIC.md' -o -name 'EXPECTED_FINDINGS.md' -o -name 'INCIDENT_ANSWER_KEY.md' -o -name 'model-solution.patch' \) -print)"
if [ -n "${hidden_hits}" ]; then
  printf '%s\n' "${hidden_hits}" | sed "s#^${export_dir}/##" >&2
  die "copied reviewer-only hidden or answer material"
fi

printf '%s\n' "${export_dir}" > "${OUTPUT_PARENT}/latest.txt"

printf 'Candidate export created.\n'
printf 'Export path: %s\n' "${export_dir}"
printf 'Latest pointer: %s\n' "${OUTPUT_PARENT}/latest.txt"
