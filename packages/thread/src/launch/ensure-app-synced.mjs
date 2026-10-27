/* @layer tooling-scripts @kind logic */
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { runBrock } from './run-brock.mjs';

const SYNC_MODULE = '@drizztdourden08/brock-build/sync-if-stale';

const noGuide = () => Promise.resolve();

const loadSync = async (appDir) => {
  try {
    const file = createRequire(join(appDir, 'package.json')).resolve(SYNC_MODULE);
    return (await import(pathToFileURL(file).href)).syncIfStaleLater;
  } catch {
    return null;
  }
};

const syncInChild = (appDir, log) => {
  const result = runBrock(appDir, ['sync', '--if-stale']);
  if (!result) return;
  if (result.status !== 0) throw new Error(`The app is not ready to launch.\n${result.output}`);
  if (result.output.includes('running brock sync first')) log(result.output);
};

/**
 * @param {string} appDir
 * @param {(message: string) => void} log
 * @returns {Promise<() => Promise<void>>} the guide to run after the spawn
 */
const ensureAppSynced = async (appDir, log) => {
  const syncIfStaleLater = await loadSync(appDir);
  if (!syncIfStaleLater) {
    syncInChild(appDir, log);
    return noGuide;
  }
  const { problem, guide } = await syncIfStaleLater(appDir, 'brock sync');
  if (problem) throw new Error(`The app is not ready to launch.\nbrock sync: ${problem}`);
  return guide;
};

/**
 * @param {() => Promise<void>} guide what ensureAppSynced returned
 * @param {(message: string) => void} log
 * @returns {void} starts the guide, logs a failure
 */
const runGuideLater = (guide, log) => {
  guide().catch((error) => log(`The Tessera guide did not finish: ${error?.message ?? error}`));
};

/**
 * @param {string} appDir
 * @param {(message: string) => void} log
 * @param {() => import('node:child_process').ChildProcess} start spawns the app
 * @returns {Promise<import('node:child_process').ChildProcess>} the app process, with the guide started after it
 */
const launchSynced = async (appDir, log, start) => {
  const guide = await ensureAppSynced(appDir, log);
  const child = start();
  runGuideLater(guide, log);
  return child;
};

export { ensureAppSynced, launchSynced, runGuideLater };
