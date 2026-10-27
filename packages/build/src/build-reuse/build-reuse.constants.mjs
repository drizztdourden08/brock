/* @layer tooling-scripts @kind constants */
const REUSE_VERSION = 2;
const REUSE_DIR = 'node_modules/.vite/brock-build-reuse';
const MODE_ENV = 'NODE_ENV_ELECTRON_VITE';
const DEV_MODE = 'development';
const VIRTUAL_PREFIX = '\0brock-reuse:';
const KEY_FILES = ['package.json', 'brock.config.ts', 'electron.vite.config.ts', 'tsconfig.json', 'pnpm-lock.yaml', 'package-lock.json', 'yarn.lock', 'node_modules/.modules.yaml', '.env', '.env.local', '.env.development', '.env.development.local'];
const DIRTY_WINDOW_MS = 1100;

export { DEV_MODE, DIRTY_WINDOW_MS, KEY_FILES, MODE_ENV, REUSE_DIR, REUSE_VERSION, VIRTUAL_PREFIX };
