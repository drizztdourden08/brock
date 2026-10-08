#!/usr/bin/env bash
# @layer tooling-scripts @kind script
# Piped by <repo> linux push into the VM as: bash -s -- <appimage> <id> <name> <icon>
# Writes the desktop entry of the pushed AppImage and pins it to the GNOME dock. Safe to run on every push.
set -u

APP="$HOME/$1"
ID="$2"
NAME="$3"
ICON="$HOME/$4"
U=$(id -u)
APPS="$HOME/.local/share/applications"
DESKTOP="$APPS/$ID.desktop"
mkdir -p "$APPS"
[ -f "$ICON" ] || ICON=application-x-executable

cat > "$DESKTOP" <<EOF
[Desktop Entry]
Type=Application
Name=$NAME
Comment=$NAME (test build)
Exec=env APPIMAGE_EXTRACT_AND_RUN=1 "$APP" --no-sandbox --ozone-platform-hint=auto
Icon=$ICON
Terminal=false
StartupWMClass=$ID
EOF
chmod +x "$DESKTOP"
update-desktop-database "$APPS" 2>/dev/null || true

export XDG_RUNTIME_DIR="/run/user/$U"
export DBUS_SESSION_BUS_ADDRESS="unix:path=/run/user/$U/bus"
CUR=$(gsettings get org.gnome.shell favorite-apps 2>/dev/null || echo "")
case "$CUR" in
  *"$ID.desktop"*) : ;;
  "["*"]") gsettings set org.gnome.shell favorite-apps "$(printf '%s' "$CUR" | sed "s/]$/, '$ID.desktop']/")" 2>/dev/null || true ;;
  *) gsettings set org.gnome.shell favorite-apps "['$ID.desktop']" 2>/dev/null || true ;;
esac
echo "[brock linux] desktop entry: $DESKTOP"
