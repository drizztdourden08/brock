/* @layer tooling-scripts @kind logic */
import { importFromApp } from '../import-from-app.mjs';
import { helperEntries } from './helper-entries.mjs';
import { helperViteConfig } from './helper-vite-config.mjs';

/**
 * @param {string} rootDir the app folder
 * @param {import('../config.mjs').BrockConfig} config brock.config.ts
 * @returns {Promise<string[]>} the helper names, built
 */
const bundleHelperScripts = async (rootDir, config) => {
  const helpers = helperEntries(rootDir, config.helpers);
  if (helpers.length === 0) return [];
  const vite = await importFromApp(rootDir, 'vite');
  for (const helper of helpers) await vite.build(helperViteConfig(rootDir, config.build, helper));
  return helpers.map(({ name }) => name);
};

/**
 * @param {string} rootDir the app folder
 * @param {import('../config.mjs').BrockConfig} config brock.config.ts
 * @param {string} command the command, for the messages
 * @returns {Promise<boolean>} false when a helper failed
 */
const bundleAppHelperScripts = async (rootDir, config, command) => {
  try {
    for (const name of await bundleHelperScripts(rootDir, config)) console.log(`${command}: built the ${name} helper into dist/helpers`);
    return true;
  } catch (error) {
    console.error(`${command}: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
};

export { bundleHelperScripts, bundleAppHelperScripts };
