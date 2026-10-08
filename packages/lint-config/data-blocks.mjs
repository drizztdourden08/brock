/* @layer tooling-scripts @kind logic */
import { dataFiles } from './data-files.mjs';
import { DATA_EXEMPT_RULES, GLOB_CHARS } from './data-kind.constants.mjs';

/**
 * @param {string} rootDir the folder the ESLint config lints from
 * @returns {import('eslint').Linter.Config[]} the exemptions of the data files
 */
const dataBlocks = (rootDir) => {
  const files = dataFiles(rootDir).map((file) => file.replace(GLOB_CHARS, '\\$&'));
  return files.length ? [{ name: 'brock/data-files', basePath: rootDir, files, rules: { ...DATA_EXEMPT_RULES } }] : [];
};

export { dataBlocks };
