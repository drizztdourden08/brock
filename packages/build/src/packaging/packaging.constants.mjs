/* @layer tooling-scripts @kind constants */
const RELEASE_DIR = 'release';
const VELOPACK_OUT = 'release/velopack';
const SPLASH_FILE = 'build/installer-splash.png';
const BUILDER_CONFIG_FILE = 'electron-builder.config.cjs';
const NOTES_DIR = 'release-notes';

const MIB = 1048576;

const UNUSED_ELECTRON_FILES = ['dxcompiler.dll', 'dxil.dll'];

const ARCH_NAMES = ['ia32', 'x64', 'armv7l', 'arm64', 'universal'];

const VELOPACK_ASAR_UNPACK = 'node_modules/velopack/lib/native/**';
const VELOPACK_NATIVE_DIR = ['app.asar.unpacked', 'node_modules', 'velopack', 'lib', 'native'];

const VELOPACK_BINDINGS = {
  'win32-ia32': 'velopack_nodeffi_win_x86_msvc.node',
  'win32-x64': 'velopack_nodeffi_win_x64_msvc.node',
  'win32-arm64': 'velopack_nodeffi_win_arm64_msvc.node',
  'linux-x64': 'velopack_nodeffi_linux_x64_gnu.node',
  'linux-arm64': 'velopack_nodeffi_linux_arm64_gnu.node',
  'darwin-x64': 'velopack_nodeffi_osx.node',
  'darwin-arm64': 'velopack_nodeffi_osx.node',
  'darwin-universal': 'velopack_nodeffi_osx.node',
};

const BUILDER_TARGETS = {
  win32: ['--win', '--dir'],
  linux: ['--linux', 'dir', 'deb'],
  darwin: ['--mac'],
};

const UNPACKED_DIRS = { win32: 'win-unpacked', linux: 'linux-unpacked' };

const CHANNEL_BY_PLATFORM = { win32: 'win', linux: 'linux', darwin: 'osx' };

const SPLASH_ICON_SIZE = 256;
const SPLASH_FALLBACK_SIZE = { width: 480, height: 360 };

const VPK_INSTALL_HINT = 'dotnet tool install -g vpk --version <the velopack version the app installs>';

const STUB_VERSION = 1;
const STUB_OUT = 'release/installer-stub';
const STUB_DIR = new URL('../../installer-stub/', import.meta.url);
const INSTALL_MANIFEST = 'install.json';
const DEFAULT_ACCENT = '#E8A33D';
const HEX_COLOR = /^#[0-9a-f]{6}$/i;

const STUB_SOURCES = [
  'main.cpp', 'state.cpp', 'cli.cpp', 'flow.cpp', 'paint.cpp', 'draw.cpp', 'screens.cpp', 'net.cpp', 'manifest.cpp', 'install.cpp',
];

const STUB_LIBS = [
  'user32.lib', 'gdi32.lib', 'gdiplus.lib', 'shlwapi.lib', 'ole32.lib', 'dwmapi.lib', 'shell32.lib', 'winhttp.lib', 'bcrypt.lib',
];

const VSWHERE = 'C:\\Program Files (x86)\\Microsoft Visual Studio\\Installer\\vswhere.exe';
const VC_TOOLS = 'Microsoft.VisualStudio.Component.VC.Tools.x86.x64';

export {
  RELEASE_DIR, VELOPACK_OUT, MIB, SPLASH_FILE, BUILDER_CONFIG_FILE, NOTES_DIR, UNUSED_ELECTRON_FILES, ARCH_NAMES,
  VELOPACK_ASAR_UNPACK, VELOPACK_NATIVE_DIR, VELOPACK_BINDINGS, BUILDER_TARGETS, UNPACKED_DIRS, CHANNEL_BY_PLATFORM,
  SPLASH_ICON_SIZE, SPLASH_FALLBACK_SIZE, VPK_INSTALL_HINT, STUB_VERSION, STUB_OUT, STUB_DIR, INSTALL_MANIFEST,
  DEFAULT_ACCENT, HEX_COLOR, STUB_SOURCES, STUB_LIBS, VSWHERE, VC_TOOLS,
};
