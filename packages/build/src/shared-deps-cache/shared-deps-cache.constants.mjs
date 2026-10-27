/* @layer tooling-scripts @kind constants */
const SHARE_VERSION = 1;
const SHARED_CACHE_ENV = 'BROCK_DEPS_CACHE_DIR';
const SHARED_CACHE_FOLDERS = ['.brock', 'cache', 'vite-deps'];
const DEPS_FOLDER = 'deps';
const METADATA_FILE = '_metadata.json';
const SHARE_FILE = 'share.json';
const PNPM_LOCKFILE = 'node_modules/.pnpm/lock.yaml';
const KEEP_ENTRIES = 6;
const STALE_TEMP_MS = 60 * 60 * 1000;

export { DEPS_FOLDER, KEEP_ENTRIES, METADATA_FILE, PNPM_LOCKFILE, SHARE_FILE, SHARE_VERSION, SHARED_CACHE_ENV, SHARED_CACHE_FOLDERS, STALE_TEMP_MS };
