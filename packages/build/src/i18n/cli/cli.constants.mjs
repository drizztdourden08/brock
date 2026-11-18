/* @layer tooling-scripts @kind constants */
const I18N_VERBS = ['check', 'coverage', 'add', 'todo', 'merge', 'tessera-base'];
const SOURCE_FILE = /\.[cm]?[jt]sx?$/;
const SKIPPED_FOLDER = /(?:^|[\\/])(?:node_modules|locales|\.brock)(?:[\\/]|$)/;
const KEY_USE = /['"`]([a-z][a-z0-9-]*:[A-Za-z0-9_.-]+)['"`]/g;
const MISSING_LISTED = 5;
const TESSERA_BASE_OUTPUT = 'packages/modules/i18n/src/locales/en/tessera.json';
const TESSERA_STRINGS_ENTRY = '@drizztdourden08/tessera/primitives/strings';
const TESSERA_NAMESPACE = 'tessera';
const ARG_OPEN = '\u0001';
const ARG_OPEN_ALT = '\u0002';
const I18N_USAGE = 'brock i18n <check [--locale tag] | coverage | add <tag> | todo <tag> [--out file] | merge <file> | tessera-base [--out file]>';

export { ARG_OPEN, ARG_OPEN_ALT, I18N_USAGE, I18N_VERBS, KEY_USE, MISSING_LISTED, SKIPPED_FOLDER, SOURCE_FILE, TESSERA_BASE_OUTPUT, TESSERA_NAMESPACE, TESSERA_STRINGS_ENTRY };
