/* @layer tooling-scripts @kind logic */
import { runBrock } from './run-brock.mjs';

/**
 * @param {string} appDir
 * @param {(message: string) => void} log
 * @returns {void}
 */
const ensureAppIcons = (appDir, log) => {
  const result = runBrock(appDir, ['icons']);
  if (result && result.status !== 0) log(`brock icons failed before launch: ${result.output}`);
};

export { ensureAppIcons };
