#!/usr/bin/env bash
# @layer tooling-scripts @kind script
# Piped by <repo> linux push into the VM as: bash -s -- <appimage> <log> <flags...>
# Swaps in the staged copy, then starts the app on the logged-in desktop: Wayland when the
# session has a Wayland socket, else X11 on :0. No FUSE needed (extract and run).
set -u

APP="$HOME/$1"
LOG="/tmp/$2.log"
shift 2
U=$(id -u)

pkill -f "$APP" 2>/dev/null || true
sleep 1
[ -f "$APP.incoming" ] && mv -f "$APP.incoming" "$APP"
chmod +x "$APP" 2>/dev/null || true

export APPIMAGE_EXTRACT_AND_RUN=1
export XDG_RUNTIME_DIR="/run/user/$U"
export DBUS_SESSION_BUS_ADDRESS="${DBUS_SESSION_BUS_ADDRESS:-unix:path=/run/user/$U/bus}"
FLAGS="--no-sandbox"
if [ -S "$XDG_RUNTIME_DIR/${WAYLAND_DISPLAY:-wayland-0}" ]; then
  export WAYLAND_DISPLAY="${WAYLAND_DISPLAY:-wayland-0}"
  FLAGS="$FLAGS --ozone-platform=wayland --enable-features=UseOzonePlatform"
else
  export DISPLAY="${DISPLAY:-:0}"
fi

setsid "$APP" $FLAGS "$@" </dev/null >"$LOG" 2>&1 &
PID=$!
disown
sleep 4
if kill -0 "$PID" 2>/dev/null || pgrep -f "$APP" >/dev/null; then
  echo "[brock linux] running (log: $LOG)"
else
  echo "[brock linux] the app exited early. The end of its log:" >&2
  grep -vE 'appimage_extracted|prebuilds' "$LOG" | tail -20 >&2
  exit 1
fi
