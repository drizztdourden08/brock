/* @layer tooling-scripts @kind logic */
import { DEV_MODE, MODE_ENV } from '../build-reuse/build-reuse.constants.mjs';
import { ensureElectron } from '../ensure-electron.mjs';
import { ensureSyncedLater } from '../freshness/ensure-synced.mjs';
import { importFromApp } from '../import-from-app.mjs';

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
 * @param {{ rootDir: string }} ctx the app folder
 * @returns {Promise<number>} 0 once main, preload and renderer are warm
 */
const runPrewarm = async ({ rootDir }) => {
  process.env[MODE_ENV] = DEV_MODE;
  const started = Date.now();
  const synced = await ensureSyncedLater(rootDir, 'brock prewarm');
  if (synced.problem) {
    console.error(`${TAG} ${synced.problem}`);
    return 1;
  }
  const electron = ensureElectron(rootDir);
  if (!electron.ok) console.warn(`${TAG} ${electron.message}`);
  const [electronVite, vite] = await Promise.all([importFromApp(rootDir, 'electron-vite'), importFromApp(rootDir, 'vite')]);
  const { main, preload, renderer } = (await electronVite.resolveConfig({ root: rootDir }, 'serve', DEV_MODE)).config ?? {};
  for (const side of [main, preload].filter(Boolean)) await vite.build(side);
  console.log(`${TAG} main and preload built in ${seconds(started)}.`);
  const count = renderer ? await optimizeRenderer(vite, renderer) : 0;
  console.log(`${TAG} ${count} renderer dependencies pre-bundled; ready in ${seconds(started)}.`);
  return 0;
};

export { runPrewarm };
