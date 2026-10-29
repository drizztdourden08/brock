/* @layer tooling-scripts @kind constants */
const KEY_VERSION = 2;
const KEY_LENGTH = 16;
const DEPS_FOLDER = 'deps';
const PNPM_LOCKFILE = 'node_modules/.pnpm/lock.yaml';
const REPORTED = { restored: 'seeded', ready: 'present', missing: 'missing' };

export { DEPS_FOLDER, KEY_LENGTH, KEY_VERSION, PNPM_LOCKFILE, REPORTED };
