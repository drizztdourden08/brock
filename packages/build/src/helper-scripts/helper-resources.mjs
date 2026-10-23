/* @layer tooling-scripts @kind logic */
import { helperEntries } from './helper-entries.mjs';
import { HELPER_EXT, HELPERS_OUT, HELPERS_RESOURCES } from './helper-scripts.constants.mjs';

/**
 * @param {string} rootDir the app folder
 * @param {Record<string, string> | undefined} helpers helpers of brock.config.ts
 * @returns {{ from: string, to: string, filter: string[] }[]} extraResources, outside the asar
 */
const helperResources = (rootDir, helpers) => {
  const names = helperEntries(rootDir, helpers).map(({ name }) => `${name}${HELPER_EXT}`);
  return names.length ? [{ from: HELPERS_OUT, to: HELPERS_RESOURCES, filter: names }] : [];
};

export { helperResources };
