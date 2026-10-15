/* @layer tooling-scripts @kind constants */
const TESSERA_TOKENS_JSON = 'tokens.json';
const TESSERA_PALETTE_CSS = 'src/tokens/palette.css';
const TESSERA_PALETTES_DIR = 'src/tokens/palettes';
const TESSERA_CONFIG_ENTRY = '@drizztdourden08/tessera/config';
const APP_THEME_CSS = 'src/theme.css';
const MISSING_MODULE_CODES = new Set(['MODULE_NOT_FOUND', 'ERR_MODULE_NOT_FOUND', 'ERR_PACKAGE_PATH_NOT_EXPORTED']);
const SEED_NAMES = { primary: '--p-primary', black: '--p-black' };
const DARK_PAIR_NAMES = { from: '--p-gradient-dark-from', to: '--p-gradient-dark-to' };
const LOOK_CORE_ENTRY = 'virtual:brock-look-core';
const LOOK_CORE_SOURCE = [
  "export { defineProduct } from '@drizztdourden08/brock-core/product';",
  "export { resolveLook, darkPair } from '@drizztdourden08/brock-core/look';",
].join('\n');
const SOURCE_SCOPE_PATTERN = /^@drizztdourden08\//;

export { APP_THEME_CSS, DARK_PAIR_NAMES, LOOK_CORE_ENTRY, LOOK_CORE_SOURCE, MISSING_MODULE_CODES, SEED_NAMES, SOURCE_SCOPE_PATTERN, TESSERA_CONFIG_ENTRY, TESSERA_PALETTE_CSS, TESSERA_PALETTES_DIR, TESSERA_TOKENS_JSON };
