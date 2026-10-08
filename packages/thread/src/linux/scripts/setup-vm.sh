#!/usr/bin/env bash
# @layer tooling-scripts @kind script
# One-time setup of the Linux VM (or the WSL distro) that builds and runs the app:
# build tools, rsync, Node 24 with pnpm, .NET 8 with vpk, the Electron runtime libraries, and sshd.
# Run it on the VM once, in its own terminal: bash setup-vm.sh
set -euo pipefail

sudo apt-get update
sudo apt-get install -y build-essential pkg-config git rsync curl openssh-server \
  libudev-dev libusb-1.0-0-dev dotnet-sdk-8.0 \
  libnss3 libgbm1 libgtk-3-0 libnotify4 libxss1 libxtst6 libatk-bridge2.0-0 libdrm2 xdg-utils
sudo apt-get install -y libasound2t64 2>/dev/null || sudo apt-get install -y libasound2 || true
sudo apt-get install -y libfuse2t64 2>/dev/null || sudo apt-get install -y libfuse2 2>/dev/null || true

if [ ! -d "$HOME/.nvm" ]; then
  curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
fi
export NVM_DIR="$HOME/.nvm"
# shellcheck disable=SC1091
. "$NVM_DIR/nvm.sh"
nvm install 24
nvm alias default 24
corepack enable

dotnet tool update -g vpk || dotnet tool install -g vpk

if systemctl list-unit-files 2>/dev/null | grep -q '^ssh.socket'; then
  sudo systemctl enable --now ssh.socket
else
  sudo systemctl enable --now ssh 2>/dev/null || true
fi
sudo usermod -aG vboxsf "$USER" 2>/dev/null || true

echo "[brock linux] setup done: node $(node -v). Log out and back in once so the vboxsf group applies."
