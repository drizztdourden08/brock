/* @layer tooling-scripts @kind logic */
import { runBrock } from './run-brock.mjs';

/**
 * @param {string} appDir
 * @param {(appDir: string, args: string[], opts: { inherit: boolean }) => { status: number | null } | null} [run]
 * @returns {string | null} why the build failed, or null
 */
const buildIfStale = (appDir, run = runBrock) => {
  const result = run(appDir, ['build', '--if-stale'], { inherit: true });
  if (!result || result.status === 0) return null;
  return `brock build failed (exit ${result.status ?? 'signal'})`;
};

export { buildIfStale };
