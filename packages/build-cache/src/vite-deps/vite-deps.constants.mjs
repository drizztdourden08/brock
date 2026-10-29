/* @layer tooling-scripts @kind constants */
const METADATA_FILE = '_metadata.json';
const ENTRY_NAME = 'renderer';
const LAYOUT = 1;
const ROOT_MARK = '@root/';
const PACKAGES_MARK = 'node_modules/.pnpm/';
const RESTORE_SUFFIX = '.restore';
const WAIT_LIMIT_MS = 3 * 60 * 1000;
const WAIT_POLL_MS = 1000;

export { ENTRY_NAME, LAYOUT, METADATA_FILE, PACKAGES_MARK, RESTORE_SUFFIX, ROOT_MARK, WAIT_LIMIT_MS, WAIT_POLL_MS };
