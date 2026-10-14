/* @layer tooling-scripts @kind logic */
import { dataFiles } from './data-files.mjs';
import { DATA_EXEMPT_RULES, GLOB_CHARS } from './data-kind.constants.mjs';

/**
 * @param {string} rootDir the folder the ESLint config lints from
 * @param {{ file: string }[]} [entries] the data and verbatim files, when the caller has listed them
 * @returns {import('eslint').Linter.Config[]} the exemptions of the data files
 */
const dataBlocks = (rootDir, entries = dataFiles(rootDir)) => {
  const files = entries.map(({ file }) => file.replace(GLOB_CHARS, '\\$&'));
  return files.length ? [{ name: 'brock/data-files', basePath: rootDir, files, rules: { ...DATA_EXEMPT_RULES } }] : [];
};

export { dataBlocks };
