#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'USAGE'
Usage:
  scripts/repowise-update.sh [repo-path] [--provider gemini] [--model MODEL] [--workspace] [--repo ALIAS] [--dry-run]

Safe wrapper around repowise update.
It never prints secrets. Provider keys must already be loaded in the environment or .repowise/.env.
USAGE
}

if [ "${1:-}" = "--help" ] || [ "${1:-}" = "-h" ]; then
  usage
  exit 0
fi

if ! command -v repowise >/dev/null 2>&1; then
  echo "ERROR: repowise is not installed."
  exit 1
fi

repo_path="."
args=()

if [ $# -gt 0 ] && [[ "${1:-}" != --* ]]; then
  repo_path="$1"
  shift
fi

while [ $# -gt 0 ]; do
  case "$1" in
    --provider|--model|--repo)
      [ $# -lt 2 ] && echo "ERROR: $1 needs a value." && exit 1
      args+=("$1" "$2")
      shift 2
      ;;
    --workspace|--dry-run)
      args+=("$1")
      shift
      ;;
    *)
      echo "ERROR: unknown arg: $1"
      usage
      exit 1
      ;;
  esac
done

if [ ! -d "$repo_path" ]; then
  echo "ERROR: repo path does not exist: $repo_path"
  exit 1
fi

cd "$repo_path"

if [ ! -d ".repowise" ] && [[ " ${args[*]} " != *" --workspace "* ]]; then
  echo "ERROR: .repowise not found. Run repowise init first."
  exit 1
fi

echo "Running: repowise update ${args[*]} $PWD"
repowise update "${args[@]}" "$PWD"
