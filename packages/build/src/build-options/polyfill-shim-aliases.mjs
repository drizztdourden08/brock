/* @layer tooling-scripts @kind logic */
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { NODE_POLYFILLS_PACKAGE, NODE_POLYFILLS_SHIMS } from './build-options.constants.mjs';

const resolveShim = (appRequire, specifier) => {
  try {
    return appRequire.resolve(specifier);
  } catch {
    return undefined;
  }
};

/**
 * The plugin injects bare imports of its shims into every file that uses Buffer, process or global,
 * and a workspace package outside the app cannot resolve them under pnpm. Each shim is pinned to
 * the copy the app resolves.
 * @param {string} rootDir the app root
 * @param {{ nodePolyfills?: boolean | Record<string, unknown> } | undefined} build build of brock.config.ts
 * @returns {{ find: RegExp, replacement: string }[]} exact-match aliases, none when the polyfills are off or a shim is missing
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
 * @returns {Record<string, string> | { find: string | RegExp, replacement: string }[]} the aliases, with the shim aliases after them when there are any
 */
const withShimAliases = (alias, rootDir, build) => {
  const shims = polyfillShimAliases(rootDir, build);
  if (shims.length === 0) return alias;
  return [...Object.entries(alias).map(([find, replacement]) => ({ find, replacement })), ...shims];
};

export { polyfillShimAliases, withShimAliases };
