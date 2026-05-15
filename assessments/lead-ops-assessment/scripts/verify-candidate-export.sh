#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
ASSESSMENT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd -P)"
DEFAULT_OUTPUT_PARENT="${ASSESSMENT_ROOT}/tmp/candidate-exports"

die() {
  printf 'Verification failed: %s\n' "$1" >&2
  exit 1
}

resolve_export_dir() {
  if [ "${1:-}" != "" ]; then
    case "$1" in
      /*) printf '%s\n' "$1" ;;
      *) printf '%s\n' "${ASSESSMENT_ROOT}/$1" ;;
    esac
    return
  fi

  if [ -f "${DEFAULT_OUTPUT_PARENT}/latest.txt" ]; then
    sed -n '1p' "${DEFAULT_OUTPUT_PARENT}/latest.txt"
    return
  fi

  if [ -d "${DEFAULT_OUTPUT_PARENT}" ]; then
    find "${DEFAULT_OUTPUT_PARENT}" -maxdepth 1 -type d -name 'lead-ops-assessment-candidate-*' -print | sort | tail -n 1
  fi
}

assert_present() {
  local relative_path="$1"
  [ -e "${export_dir}/${relative_path}" ] || die "missing candidate path ${relative_path}"
}

assert_absent() {
  local relative_path="$1"
  [ ! -e "${export_dir}/${relative_path}" ] || die "reviewer-only path present: ${relative_path}"
}

export_dir="$(resolve_export_dir "${1:-}")"
[ -n "${export_dir}" ] || die "no export found; run scripts/export-candidate-package.sh first"
[ -d "${export_dir}" ] || die "export path is not a directory: ${export_dir}"

required_paths=(
  ".gitignore"
  ".env.example"
  "AI_USAGE.md"
  "ASSESSMENT.md"
  "README.md"
  "assignment/PROMPT.md"
  "assignment/SUBMISSION_CHECKLIST.md"
  "docs/RUNBOOK.md"
  "fixtures"
  "package-lock.json"
  "package.json"
  "review/FINAL_REVIEW.md"
  "review/intern-a-performance-cleanup.md"
  "review/intern-a-performance-cleanup.patch"
  "review/intern-b-ui-polish.md"
  "review/intern-b-ui-polish.patch"
  "scripts/reset-demo-state.mjs"
  "src"
  "tests/public"
  "tests/setup.ts"
)

for relative_path in "${required_paths[@]}"; do
  assert_present "${relative_path}"
done

for forbidden_path in \
  "docs/SPEC.md" \
  "docs/ARCHITECTURE.md" \
  "docs/EXPORT_POLICY.md" \
  "docs/CANDIDATE_REPO_RUNBOOK.md" \
  "reviewer" \
  "reviewer/ANSWER_KEY.md" \
  "reviewer/EXPECTED_FINDINGS.md" \
  "reviewer/SCORING_RUBRIC.md" \
  "reviewer/hidden-tests" \
  "reviewer/model-solution.patch" \
  "scripts/export-candidate-package.sh" \
  "scripts/verify-candidate-export.sh" \
  "scripts/verify-hidden-tests.mjs" \
  "scripts/check-intern-a.mjs" \
  "scripts/check-intern-b.mjs" \
  ".codex-autorunner" \
  "projects" \
  ".git" \
  "node_modules" \
  "dist" \
  "coverage" \
  "tmp"; do
  assert_absent "${forbidden_path}"
done

hidden_hits="$(find "${export_dir}" \( -path '*/reviewer/*' -o -name '*hidden*' -o -name 'ANSWER_KEY.md' -o -name 'SCORING_RUBRIC.md' -o -name 'EXPECTED_FINDINGS.md' -o -name 'model-solution.patch' \) -print)"
if [ -n "${hidden_hits}" ]; then
  printf 'Forbidden reviewer-only files found:\n' >&2
  printf '%s\n' "${hidden_hits}" | sed "s#^${export_dir}/##" >&2
  die "candidate export contains hidden or answer material"
fi

forbidden_env_files="$(find "${export_dir}" -type f \( -name '.env' -o -name '.env.*' \) ! -name '.env.example' -print)"
if [ -n "${forbidden_env_files}" ]; then
  printf 'Forbidden env files found:\n' >&2
  printf '%s\n' "${forbidden_env_files}" | sed "s#^${export_dir}/##" >&2
  die "candidate export contains real-env filename"
fi

node --input-type=module - "${export_dir}/package.json" <<'NODE'
import { readFileSync } from "node:fs";

const packagePath = process.argv[2];
const packageJson = JSON.parse(readFileSync(packagePath, "utf8"));
const scripts = packageJson.scripts ?? {};
const forbiddenScripts = Object.keys(scripts).filter(
  (scriptName) => scriptName === "test:hidden" || scriptName.startsWith("reviewer:")
);

if (forbiddenScripts.length > 0) {
  console.error(`Reviewer-only npm scripts present: ${forbiddenScripts.join(", ")}`);
  process.exit(1);
}

for (const requiredScript of ["typecheck", "test:public"]) {
  if (!scripts[requiredScript]) {
    console.error(`Missing candidate npm script: ${requiredScript}`);
    process.exit(1);
  }
}
NODE

verify_root="$(mktemp -d "${TMPDIR:-/tmp}/lead-ops-export-verify.XXXXXX")"
verify_dir="${verify_root}/package"
trap 'rm -rf "${verify_root}"' EXIT
cp -R "${export_dir}" "${verify_dir}"

run_in_verify_copy() {
  printf 'Running in verification copy: %s\n' "$*"
  (
    cd "${verify_dir}"
    FORCE_COLOR=0 "$@"
  )
}

run_in_verify_copy npm ci
run_in_verify_copy npm run typecheck
run_in_verify_copy npm run test:public

printf 'Candidate export verified.\n'
printf 'Verified export path: %s\n' "${export_dir}"
