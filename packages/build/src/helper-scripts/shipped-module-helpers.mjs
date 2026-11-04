/* @layer tooling-scripts @kind logic */
import { moduleHelperEntries } from './module-helper-entries.mjs';

/**
 * @param {string} rootDir the app folder
 * @param {import('../config.mjs').BrockConfig} config brock.config.ts
 * @returns {Record<string, string>} module helpers that ship: name to absolute entry
 */
const shippedModuleHelpers = (rootDir, config) =>
  Object.fromEntries(moduleHelperEntries(rootDir, config).filter(({ packaged }) => packaged).map(({ name, entry }) => [name, entry]));

export { shippedModuleHelpers };
