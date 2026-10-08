/* @layer tooling-scripts @kind logic */
import { extraAliases } from './app-aliases.mjs';
import { TSCONFIG_APP_PATH } from './build-options.constants.mjs';

const relativeFolder = (target) => {
  const folder = target.replace(/\\/g, '/').replace(/\/+$/, '');
  return folder.startsWith('.') ? folder : `./${folder}`;
};

/**
 * @param {string} tsconfig the managed tsconfig.json text
 * @param {Record<string, string> | undefined} aliases build.aliases of brock.config.ts
 * @returns {string} the same text with a paths entry per extra alias after @app
 */
const withAliasPaths = (tsconfig, aliases) => {
  const lines = extraAliases(aliases).map(([name, target]) => `"${name}/*": ["${relativeFolder(target)}/*"],`);
  if (!lines.length) return tsconfig;
  const at = tsconfig.indexOf(TSCONFIG_APP_PATH);
  if (at === -1) throw new Error('the managed tsconfig.json template has no @app path to add the aliases after');
  const indent = tsconfig.slice(tsconfig.lastIndexOf('\n', at) + 1, at);
  const end = at + TSCONFIG_APP_PATH.length;
  return `${tsconfig.slice(0, end)}${lines.map((line) => `\n${indent}${line}`).join('')}${tsconfig.slice(end)}`;
};

export { withAliasPaths };
