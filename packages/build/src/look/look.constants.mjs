/* @layer tooling-scripts @kind constants */
const TESSERA_TOKENS_JSON = 'tokens.json';
const TESSERA_PALETTE_CSS = 'src/tokens/palette.css';
const TESSERA_CONFIG_ENTRY = '@drizztdourden08/tessera/config';
const APP_THEME_CSS = 'src/theme.css';
const MISSING_MODULE_CODES = new Set(['MODULE_NOT_FOUND', 'ERR_MODULE_NOT_FOUND', 'ERR_PACKAGE_PATH_NOT_EXPORTED']);
const SEED_NAMES = { primary: '--p-primary', black: '--p-black' };
const CORE_PACKAGE = '@drizztdourden08/brock-core';
const SOURCE_SCOPE_PATTERN = /^@drizztdourden08\//;

export { APP_THEME_CSS, CORE_PACKAGE, MISSING_MODULE_CODES, SEED_NAMES, SOURCE_SCOPE_PATTERN, TESSERA_CONFIG_ENTRY, TESSERA_PALETTE_CSS, TESSERA_TOKENS_JSON };
