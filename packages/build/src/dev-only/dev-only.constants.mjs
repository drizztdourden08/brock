/* @layer tooling-scripts @kind constants */
const DEV_SOURCE = /\.dev\.(?:ts|tsx|mts|js|jsx|mjs)$/;
const DEV_REGISTRY = /(?:^|\/)\.brock\/[^/]+\.dev\.ts$/;
const EXPORT_LIST = /export\s*\{([^}]*)\}/g;
const PRODUCTION_MODE = 'production';

export { DEV_REGISTRY, DEV_SOURCE, EXPORT_LIST, PRODUCTION_MODE };
