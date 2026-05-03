#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PLUGIN_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
PATCH_DIR="${PATCH_DIR:-$PLUGIN_ROOT/patches}"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "ERROR: run inside a git worktree" >&2
  exit 1
fi

if [ ! -d "$PATCH_DIR" ]; then
  echo "No patch directory: $PATCH_DIR"
  exit 0
fi

shopt -s nullglob
patches=("$PATCH_DIR"/*.patch)
if [ "${#patches[@]}" -eq 0 ]; then
  echo "No overlay patches found in $PATCH_DIR"
  exit 0
fi

for patch in "${patches[@]}"; do
  name="$(basename "$patch")"
  if git apply --check "$patch" >/dev/null 2>&1; then
    echo "Applying overlay patch: $name"
    git apply "$patch"
  elif git apply -R --check "$patch" >/dev/null 2>&1; then
    echo "Overlay patch already applied: $name"
  else
    echo "ERROR: overlay patch does not apply cleanly: $name" >&2
    echo "Resolve upstream drift, refresh the patch, then rerun." >&2
    exit 1
  fi
done
