/* @layer tooling-scripts @kind constants */
const DIST_DIR = 'dist';
const PATH_FILE = 'path.txt';
const VERSION_FILE = 'version';
const OVERRIDE_ENV = 'ELECTRON_OVERRIDE_DIST_PATH';
const PLATFORM_SOURCES = { env: ['ELECTRON_INSTALL_PLATFORM', 'npm_config_platform'], npmrc: 'platform' };
const ARCH_SOURCES = { env: ['ELECTRON_INSTALL_ARCH', 'npm_config_arch'], npmrc: 'arch' };
const NPMRC_FILE = '.npmrc';
const RESTORE_LOCK = '.build-cache-restore.lock';
const LOCK_STALE_MS = 10 * 60 * 1000;
const LOCK_POLL_MS = 250;

export { ARCH_SOURCES, DIST_DIR, LOCK_POLL_MS, LOCK_STALE_MS, NPMRC_FILE, OVERRIDE_ENV, PATH_FILE, PLATFORM_SOURCES, RESTORE_LOCK, VERSION_FILE };
