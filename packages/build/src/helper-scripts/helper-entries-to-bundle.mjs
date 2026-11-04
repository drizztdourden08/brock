/* @layer tooling-scripts @kind logic */
import { helperEntries } from './helper-entries.mjs';
import { moduleHelperEntries } from './module-helper-entries.mjs';

/**
 * @param {string} rootDir the app folder
 * @param {import('../config.mjs').BrockConfig} config brock.config.ts
 * @returns {{ name: string, entry: string, packaged: boolean }[]} app helpers, then module helpers
 */
const helperEntriesToBundle = (rootDir, config) => {
  const planned = [...helperEntries(rootDir, config.helpers).map((helper) => ({ ...helper, packaged: true })), ...moduleHelperEntries(rootDir, config)];
  const seen = new Set();
  for (const { name } of planned) {
    if (seen.has(name)) throw new Error(`The helper "${name}" is declared twice, by the app or by modules; rename one.`);
    seen.add(name);
  }
  return planned;
};

export { helperEntriesToBundle };
