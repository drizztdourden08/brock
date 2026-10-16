/* @layer tooling-scripts @kind constants */
const META_QUERY = 'brock-meta';
const META_SUFFIX = `?${META_QUERY}`;
const META_ID = new RegExp(`[?&]${META_QUERY}(?:&|$)`);
const META_EXPORTS = ['meta', 'order'];
const META_IMPORT_LINE = /^import \{ ([^}]+) \} from '(\.\.\/src\/[^'?]+)';$/gm;
const REGISTRY_FILE = /[\\/]\.brock[\\/](?:screens|screens\.dev|widgets|title-bar)\.ts$/;
const JSX_FACTORY = 'React';

export { JSX_FACTORY, META_EXPORTS, META_ID, META_IMPORT_LINE, META_SUFFIX, REGISTRY_FILE };
