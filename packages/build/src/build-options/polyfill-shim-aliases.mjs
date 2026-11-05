/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { NODE_POLYFILLS_PACKAGE, NODE_POLYFILLS_SHIMS } from './build-options.constants.mjs';

/**
 * @param {string} commonJsFile the file require.resolve returned
 * @returns {string} the ES module twin beside it, when it exists
 */
const esModuleTwinOf = (commonJsFile) => {
  const twin = commonJsFile.replace(/\.cjs$/, '.js');
  return existsSync(twin) ? twin : commonJsFile;
};

/**
 * @param {NodeJS.Require} appRequire require rooted at the app
 * @param {string} specifier a shim specifier
 * @returns {string | undefined} the shim file, undefined when unresolved
 */
const resolveShim = (appRequire, specifier) => {
  try {
    return esModuleTwinOf(appRequire.resolve(specifier));
  } catch {
    return undefined;
  }
};

/**
 * @param {string} rootDir the app root
 * @param {{ nodePolyfills?: boolean | Record<string, unknown> } | undefined} build build of brock.config.ts
 * @returns {{ find: RegExp, replacement: string }[]} one exact alias per shim the app resolves
 */
const polyfillShimAliases = (rootDir, build) => {
  if (!(build?.nodePolyfills ?? false)) return [];
  const appRequire = createRequire(join(rootDir, 'package.json'));
  return NODE_POLYFILLS_SHIMS.flatMap((shim) => {
    const specifier = `${NODE_POLYFILLS_PACKAGE}/shims/${shim}`;
    const replacement = resolveShim(appRequire, specifier);
    return replacement ? [{ find: new RegExp(`^${specifier}$`), replacement }] : [];
  });
};

/**
 * @param {Record<string, string>} alias the app aliases
 * @param {string} rootDir the app root
 * @param {{ nodePolyfills?: boolean | Record<string, unknown> } | undefined} build build of brock.config.ts
 * @returns {Record<string, string> | { find: string | RegExp, replacement: string }[]} the app aliases, then the shim aliases
 */
const withShimAliases = (alias, rootDir, build) => {
  const shims = polyfillShimAliases(rootDir, build);
  if (shims.length === 0) return alias;
  return [...Object.entries(alias).map(([find, replacement]) => ({ find, replacement })), ...shims];
};

export { polyfillShimAliases, withShimAliases };
