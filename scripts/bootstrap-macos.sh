#!/usr/bin/env bash
set -euo pipefail

log() { printf '%s\n' "$*"; }
have() { command -v "$1" >/dev/null 2>&1; }
die() {
  log "ERROR $*"
  exit 1
}

run_best_effort() {
  label="$1"
  shift
  log "Installing/checking $label"
  if "$@"; then
    log "OK   $label"
  else
    log "WARN $label failed. Continue if not blocking; fix manually if needed."
  fi
}

ensure_homebrew_path() {
  if [ -x /opt/homebrew/bin/brew ]; then
    eval "$(/opt/homebrew/bin/brew shellenv)"
    if ! grep -qs 'eval "$(/opt/homebrew/bin/brew shellenv)"' "$HOME/.zprofile" 2>/dev/null; then
      {
        printf '\n# Homebrew\n'
        printf 'eval "$(/opt/homebrew/bin/brew shellenv)"\n'
      } >> "$HOME/.zprofile"
      log "OK   added Apple Silicon Homebrew shellenv to ~/.zprofile"
    fi
  elif [ -x /usr/local/bin/brew ]; then
    eval "$(/usr/local/bin/brew shellenv)"
    if ! grep -qs 'eval "$(/usr/local/bin/brew shellenv)"' "$HOME/.zprofile" 2>/dev/null; then
      {
        printf '\n# Homebrew\n'
        printf 'eval "$(/usr/local/bin/brew shellenv)"\n'
      } >> "$HOME/.zprofile"
      log "OK   added Intel Homebrew shellenv to ~/.zprofile"
    fi
  fi
}

log "Fresh macOS bootstrap"

if [ "$(uname -s)" != "Darwin" ]; then
  log "Non-macOS machine. Skipping macOS bootstrap."
  exit 0
fi

if ! xcode-select -p >/dev/null 2>&1; then
  log "WARN Xcode Command Line Tools missing."
  run_best_effort "Xcode Command Line Tools prompt" xcode-select --install
  log "If macOS opened a dialog, finish that install, then rerun this script."
  die "Xcode Command Line Tools gate still open. Finish the macOS prompt, then rerun ./scripts/install.sh"
else
  log "OK   Xcode Command Line Tools present"
fi

if [ "$(uname -m)" = "arm64" ]; then
  if /usr/bin/pgrep oahd >/dev/null 2>&1 || /usr/bin/pkgutil --pkg-info com.apple.pkg.RosettaUpdateAuto >/dev/null 2>&1; then
    log "OK   Rosetta present"
  else
    run_best_effort "Rosetta 2" softwareupdate --install-rosetta --agree-to-license
  fi
fi

ensure_homebrew_path

if ! have brew; then
  if have curl; then
    log "Installing Homebrew. This may ask for macOS password."
    run_best_effort "Homebrew" env NONINTERACTIVE=1 /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    ensure_homebrew_path
  else
    die "curl missing. Cannot install Homebrew automatically."
  fi
else
  log "OK   Homebrew present: $(brew --prefix)"
fi

if ! have brew; then
  die "Homebrew is required for Edward Agent Stack fresh-Mac setup. Install or fix Homebrew, then rerun ./scripts/install.sh"
fi

if have brew; then
  run_best_effort "Homebrew update" brew update
fi

log "Fresh macOS bootstrap complete."
