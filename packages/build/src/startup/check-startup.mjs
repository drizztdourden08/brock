/* @layer tooling-scripts @kind logic */
import { scanStartup } from './scan-startup.mjs';

/** @param {import('./scan-startup.mjs').PromptFile} file @returns {string[]} */
const fileFindings = (file) => (file.hasDefault ? [] : [`${file.path}: no default export; a start-up prompt file default-exports defineStartupPrompt({ run })`]);

/**
 * @param {string} rootDir the app root
 * @returns {string[]} what brock structure reports about src/startup
 */
const checkStartup = (rootDir) => {
  const { files, findings } = scanStartup(rootDir);
  return [...findings, ...files.flatMap(fileFindings)];
};

export { checkStartup };
