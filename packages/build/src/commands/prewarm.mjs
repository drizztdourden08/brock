/* @layer tooling-scripts @kind logic */
import { beginJob } from '@drizztdourden08/build-cache/jobs';
import { cloneStoreProblem, prewarmRecord } from '@drizztdourden08/brock-thread';
import { DEV_MODE, MODE_ENV } from '../build-reuse/build-reuse.constants.mjs';
import { restoreSharedBuild } from '../build-reuse/shared-build/restore-shared-build.mjs';
import { ensureElectron } from '../ensure-electron.mjs';
import { ensureSyncedLater } from '../freshness/ensure-synced.mjs';
import { importFromApp } from '../import-from-app.mjs';
import { depsEntryExists } from '../shared-deps-cache/deps-entry-exists.mjs';

const TAG = 'brock prewarm:';

const seconds = (since) => `${Math.round((Date.now() - since) / 1000)} s`;

/**
 * @param {any} vite the app's vite
 * @param {Record<string, any>} renderer the renderer config of electron-vite dev
 * @returns {Promise<number>} how many dependencies were pre-bundled
 */
const optimizeRenderer = async (vite, renderer) => {
  const metadata = await vite.optimizeDeps(await vite.resolveConfig(renderer, 'serve', DEV_MODE));
  await vite.resolveConfig(renderer, 'serve', DEV_MODE);
  return Object.keys(metadata?.optimized ?? {}).length;
};

/**
 * @param {string} rootDir the app folder
 * @param {number} started when the prewarm began
 * @returns {Promise<string | null>} why it failed, or null
 */
const warm = async (rootDir, started) => {
  const damaged = cloneStoreProblem(rootDir);
  if (damaged) console.warn(`${TAG} ${damaged}`);
  const synced = await ensureSyncedLater(rootDir, 'brock prewarm');
  if (synced.problem) return synced.problem;
  const electron = ensureElectron(rootDir);
  if (!electron.ok) console.warn(`${TAG} ${electron.message}`);
  const shared = restoreSharedBuild(rootDir, { log: (line) => console.log(`${TAG} ${line}`) });
  if (shared.hit && depsEntryExists(rootDir)) {
    console.log(`${TAG} renderer dependencies come from the build cache when the app starts; ready in ${seconds(started)}.`);
    return null;
  }
  const [electronVite, vite] = await Promise.all([importFromApp(rootDir, 'electron-vite'), importFromApp(rootDir, 'vite')]);
  const { main, preload, renderer } = (await electronVite.resolveConfig({ root: rootDir }, 'serve', DEV_MODE)).config ?? {};
  const sides = { main, preload };
  for (const name of shared.missed.filter((side) => sides[side])) await vite.build(sides[name]);
  if (shared.missed.length > 0) console.log(`${TAG} ${shared.missed.join(' and ')} built in ${seconds(started)}.`);
  const count = renderer ? await optimizeRenderer(vite, renderer) : 0;
  console.log(`${TAG} ${count} renderer dependencies pre-bundled; ready in ${seconds(started)}.`);
  return null;
};

/**
 * @param {{ rootDir: string }} ctx the app folder
 * @returns {Promise<number>} 0 once main, preload and renderer are warm
 */
const runPrewarm = async ({ rootDir }) => {
  process.env[MODE_ENV] = DEV_MODE;
  const end = beginJob(prewarmRecord(rootDir));
  const failed = await warm(rootDir, Date.now()).catch((error) => error?.message ?? String(error));
  end(failed ? { failed } : {});
  if (failed) console.error(`${TAG} ${failed}`);
  return failed ? 1 : 0;
};

export { runPrewarm };
