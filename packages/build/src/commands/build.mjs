/* @layer tooling-scripts @kind logic */
import { buildStaleReason } from '../freshness/build-stale-reason.mjs';
import { appShape } from '../platforms/server/app-shape.mjs';
import { runElectronVite } from './electron-vite.mjs';
import { runServer } from './server.mjs';

/**
 * @param {{ rootDir: string, passthrough?: string[]}} ctx
 * @returns {Promise<number>} exit code
 */
const buildApp = async (ctx) => {
  const shape = appShape(ctx.rootDir);
  if (shape.windowless) return runServer({ rootDir: ctx.rootDir, args: ['build'] });
  const code = await runElectronVite('build', ctx);
  return code === 0 && shape.server ? runServer({ rootDir: ctx.rootDir, args: ['build'] }) : code;
};

/**
 * @param {{ rootDir: string, ifStale?: boolean, passthrough?: string[]}} ctx
 * @returns {Promise<number>} exit code
 */
const runBuild = (ctx) => {
  if (!ctx.ifStale) return buildApp(ctx);
  const reason = buildStaleReason(ctx.rootDir);
  if (!reason) {
    console.log('brock build: dist holds a build of the current sources.');
    return Promise.resolve(0);
  }
  console.log(`brock build: building, since ${reason}.`);
  return buildApp(ctx);
};

export { runBuild };
