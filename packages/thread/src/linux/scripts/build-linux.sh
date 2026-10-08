#!/usr/bin/env bash
# @layer tooling-scripts @kind script
# Piped by <repo> linux push into the VM (or WSL) as: bash -s -- <source> <work> <app> <artifacts> <staged> <build...>
set -euo pipefail

abs() { case "$1" in /*) printf '%s' "$1" ;; *) printf '%s/%s' "$HOME" "$1" ;; esac; }

SRC="$(abs "$1")"
WORK="$(abs "$2")"
APP="$3"
ARTIFACTS="$4"
STAGED="$(abs "$5")"
shift 5

export NVM_DIR="$HOME/.nvm"
# shellcheck disable=SC1091
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
export PATH="$HOME/.dotnet/tools:$PATH"
command -v node >/dev/null 2>&1 || { echo "[brock linux] Node is missing here. Run setup-vm.sh once; <repo> linux init prints how." >&2; exit 1; }
command -v pnpm >/dev/null 2>&1 || corepack enable >/dev/null 2>&1 || true
echo "[brock linux] node $(node -v), pnpm $(pnpm -v)"

mkdir -p "$WORK"
rsync -a --delete \
  --exclude node_modules --exclude .git --exclude dist --exclude release --exclude out \
  --exclude .user-data --exclude .worktrees --exclude .brock-port-slot \
  "$SRC/" "$WORK/"

cd "$WORK"
pnpm install
cd "$WORK/$APP"
"$@"

FOUND="$(ls -t "$ARTIFACTS"/*.AppImage 2>/dev/null | head -n1 || true)"
[ -n "$FOUND" ] || { echo "[brock linux] The build left no AppImage in $APP/$ARTIFACTS." >&2; exit 1; }
cp "$FOUND" "$STAGED"
chmod +x "$STAGED"
echo "[brock linux] staged $STAGED"
