/* @layer tooling-scripts @kind logic */
import { buildStaleReason } from '../freshness/build-stale-reason.mjs';
import { runElectronVite } from './electron-vite.mjs';

/**
 * @param {{ rootDir: string, ifStale?: boolean, passthrough?: string[]}} ctx
 * @returns {Promise<number>} exit code
 */
const runBuild = (ctx) => {
  if (!ctx.ifStale) return runElectronVite('build', ctx);
  const reason = buildStaleReason(ctx.rootDir);
  if (!reason) {
    console.log('brock build: dist holds a build of the current sources.');
    return Promise.resolve(0);
  }
  console.log(`brock build: building, since ${reason}.`);
  return runElectronVite('build', ctx);
};

export { runBuild };
