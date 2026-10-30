/* @layer tooling-scripts @kind constants */
const KEY_VERSION = 3;
const KEY_LENGTH = 16;
const DEPS_FOLDER = 'deps';
const STORE_TOKEN = '@store';
const PNPM_LOCKFILE = 'node_modules/.pnpm/lock.yaml';
const PLUGIN_NAME = 'brock:shared-deps-cache';
const REPORTED = { restored: 'seeded', ready: 'present', missing: 'missing' };

export { DEPS_FOLDER, KEY_LENGTH, KEY_VERSION, PLUGIN_NAME, PNPM_LOCKFILE, REPORTED, STORE_TOKEN };
