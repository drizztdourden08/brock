/* @layer tooling-scripts @kind logic */
import { clearInterval, setInterval } from 'node:timers';
import { DEV_MODE, MODE_ENV } from '../build-reuse/build-reuse.constants.mjs';
import { importFromApp } from '../import-from-app.mjs';
import { optimizeRenderer } from '../optimize-deps/optimize-renderer.mjs';

const TAG = 'brock dev:';

const HEARTBEAT_MS = 15000;

const elapsed = (since) => Math.round((Date.now() - since) / 1000);

const prebundle = async (rootDir) => {
  const [electronVite, vite] = await Promise.all([importFromApp(rootDir, 'electron-vite'), importFromApp(rootDir, 'vite')]);
  const { renderer } = (await electronVite.resolveConfig({ root: rootDir }, 'serve', DEV_MODE)).config ?? {};
  if (!renderer) return;
  const started = Date.now();
  let beat;
  const announce = () => {
    console.log(`${TAG} pre-bundling renderer dependencies before the window opens...`);
    beat = setInterval(() => console.log(`${TAG} still pre-bundling, ${elapsed(started)} s so far...`), HEARTBEAT_MS);
  };
  const count = await optimizeRenderer(vite, renderer, announce).finally(() => clearInterval(beat));
  if (count !== null) console.log(`${TAG} ${count} renderer dependencies pre-bundled in ${elapsed(started)} s.`);
};

/**
 * @param {string} rootDir the app folder
 * @returns {Promise<void>} a failure only warns
 */
const prebundleForDev = async (rootDir) => {
  process.env[MODE_ENV] = DEV_MODE;
  await prebundle(rootDir).catch((error) => console.warn(`${TAG} the renderer pre-bundle did not finish, the dev server will do it: ${error?.message ?? error}`));
};

export { prebundleForDev };
