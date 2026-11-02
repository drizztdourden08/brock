/* @layer tooling-scripts @kind constants */
const REUSE_VERSION = 4;
const REUSE_DIR = 'node_modules/.vite/brock-build-reuse';
const MODE_ENV = 'NODE_ENV_ELECTRON_VITE';
const DEV_MODE = 'development';
const VIRTUAL_PREFIX = '\0brock-reuse:';
const KEY_FILES = ['package.json', 'brock.config.ts', 'electron.vite.config.ts', 'tsconfig.json', 'package-lock.json', 'yarn.lock', 'node_modules/.pnpm/lock.yaml', '.env', '.env.local', '.env.development', '.env.development.local'];
const GENERATED_DIR = '.brock';
const GENERATED_AT_LAUNCH = ['tessera-parts.ts'];
const DIRTY_WINDOW_MS = 1100;
const PLACED_FOLDER = ['node_modules', '.build-cache', 'node_modules'];
const PLACED_MARKER = '.build-cache.json';

export { DEV_MODE, DIRTY_WINDOW_MS, GENERATED_AT_LAUNCH, GENERATED_DIR, KEY_FILES, MODE_ENV, PLACED_FOLDER, PLACED_MARKER, REUSE_DIR, REUSE_VERSION, VIRTUAL_PREFIX };
