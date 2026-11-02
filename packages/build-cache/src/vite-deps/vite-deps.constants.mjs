/* @layer tooling-scripts @kind constants */
const METADATA_FILE = '_metadata.json';
const ENTRY_NAME = 'renderer';
const LAYOUT = 2;
const ROOT_MARK = '@root/';
const PACKAGES_MARK = 'node_modules/.pnpm/';
const RESTORE_SUFFIX = '.restore';
const WAIT_LIMIT_MS = 3 * 60 * 1000;
const WAIT_POLL_MS = 1000;
const FILE_TOKENS = Object.freeze({ store: '@@brock-deps-store@@/', root: '@@brock-deps-root@@/' });
const BUNDLE_FILE = /\.(?:[cm]?js|map)$/;

export { BUNDLE_FILE, ENTRY_NAME, FILE_TOKENS, LAYOUT, METADATA_FILE, PACKAGES_MARK, RESTORE_SUFFIX, ROOT_MARK, WAIT_LIMIT_MS, WAIT_POLL_MS };
