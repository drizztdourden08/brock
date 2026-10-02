/* @layer tooling-scripts @kind constants */
const TESSERA_CONFIG_FILE = 'tessera.config.json';
const TESSERA_SCHEMA_REF = './node_modules/@drizztdourden08/tessera/tessera.config.schema.json';
const DESIGN_DIR = 'packages/design';
const SHARED_KINDS = Object.freeze(['primitives', 'composites', 'compounds']);
const DEFAULT_TOKEN_GLOBS = Object.freeze(['**/src/**/theme.css', '**/tokens/**/*.css']);
const DEFAULT_THEME_PATH = /(^|\/)src\/(.+\/)?theme\.css$/;

export { DEFAULT_THEME_PATH, DEFAULT_TOKEN_GLOBS, DESIGN_DIR, SHARED_KINDS, TESSERA_CONFIG_FILE, TESSERA_SCHEMA_REF };
