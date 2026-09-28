/* @layer tooling-scripts @kind constants */
const RELEASE_DIR = 'release';
const VELOPACK_OUT = 'release/velopack';
const SPLASH_FILE = 'build/installer-splash.png';
const BUILDER_CONFIG_FILE = 'electron-builder.config.cjs';
const NOTES_DIR = 'release-notes';

const MIB = 1048576;

const UNUSED_ELECTRON_FILES =['dxcompiler.dll', 'dxil.dll'];

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
  linux: ['--linux', 'dir'],
  darwin: ['--mac'],
};

const UNPACKED_DIRS = { win32: 'win-unpacked', linux: 'linux-unpacked' };

const CHANNEL_BY_PLATFORM = { win32: 'win', linux: 'linux', darwin: 'osx' };

const SPLASH_ICON_SIZE = 256;
const SPLASH_FALLBACK_SIZE = { width: 480, height: 360 };

const VPK_INSTALL_HINT = 'dotnet tool install -g vpk --version <the velopack version the app installs>';

export {
  RELEASE_DIR, VELOPACK_OUT, MIB, SPLASH_FILE, BUILDER_CONFIG_FILE, NOTES_DIR, UNUSED_ELECTRON_FILES, ARCH_NAMES,
  VELOPACK_ASAR_UNPACK, VELOPACK_NATIVE_DIR, VELOPACK_BINDINGS, BUILDER_TARGETS, UNPACKED_DIRS, CHANNEL_BY_PLATFORM,
  SPLASH_ICON_SIZE, SPLASH_FALLBACK_SIZE, VPK_INSTALL_HINT,
};
