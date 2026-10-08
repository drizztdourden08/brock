/* @layer tooling-scripts @kind logic */
import { isAbsolute, resolve } from 'node:path';
import { ALIAS_NAME, APP_ALIAS } from './build-options.constants.mjs';

/**
 * @param {Record<string, string> | undefined} aliases build.aliases of brock.config.ts
 * @returns {[string, string][]} each alias and its folder as written, checked
 */
const extraAliases = (aliases) => Object.entries(aliases ?? {}).map(([name, target]) => {
  if (name === APP_ALIAS) throw new Error(`brock.config.ts build.aliases: ${APP_ALIAS} is Brock's own alias for src and cannot be set`);
  if (!ALIAS_NAME.test(name)) throw new Error(`brock.config.ts build.aliases: "${name}" is not an import prefix such as @shared`);
  if (typeof target !== 'string' || !target.trim()) throw new Error(`brock.config.ts build.aliases: ${name} needs a folder, relative to the app folder`);
  if (isAbsolute(target)) throw new Error(`brock.config.ts build.aliases: ${name} points at an absolute path; give it relative to the app folder`);
  return [name, target];
});

/**
 * @param {string} rootDir the app root
 * @param {{ aliases?: Record<string, string> } | undefined} build build of brock.config.ts
 * @returns {Record<string, string>} @app and the app's extra aliases, as absolute folders
 */
const appAliases = (rootDir, build) => ({
  [APP_ALIAS]: resolve(rootDir, 'src'),
  ...Object.fromEntries(extraAliases(build?.aliases).map(([name, target]) => [name, resolve(rootDir, target)])),
});

export { appAliases, extraAliases };
