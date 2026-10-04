/* @layer tooling-scripts @kind logic */
import { runBrock } from './run-brock.mjs';

/**
 * @param {string} appDir
 * @param {(message: string) => void} log
 * @returns {void} throws when the app cannot launch
 */
const ensureAppSynced = (appDir, log) => {
  const result = runBrock(appDir, ['sync', '--if-stale']);
  if (!result) return;
  if (result.status !== 0) throw new Error(`The app is not ready to launch.\n${result.output}`);
  if (result.output.includes('running brock sync first')) log(result.output);
};

export { ensureAppSynced };
