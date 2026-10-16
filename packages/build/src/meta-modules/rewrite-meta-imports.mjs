/* @layer tooling-scripts @kind logic */
import { META_EXPORTS, META_IMPORT_LINE, META_SUFFIX } from './meta-modules.constants.mjs';

/** @param {string} names the inside of an import's braces */
const onlyMeta = (names) => names.split(',').map((name) => name.trim().split(/\s+as\s+/)[0]).every((name) => META_EXPORTS.includes(name));

/**
 * @param {string} code a generated .brock registry
 * @returns {string} meta-only imports pointed at meta modules
 */
const rewriteMetaImports = (code) =>
  code.replace(META_IMPORT_LINE, (line, names, from) => (onlyMeta(names) ? `import { ${names} } from '${from}${META_SUFFIX}';` : line));

export { rewriteMetaImports };
