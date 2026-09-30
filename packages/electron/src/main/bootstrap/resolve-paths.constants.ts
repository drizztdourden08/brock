/* @layer electron-main @kind constants */
import type { BootstrapPaths } from '../types/main-context.type';

const DEFAULT_PATHS: Required<BootstrapPaths> = {
  preload: '../preload/preload.mjs',
  renderer: '../renderer/index.html',
  splash: '../renderer/splash.html',
  splashPreload: '../preload/splash-preload.mjs',
};

const PRELOAD_FALLBACK = '../preload/preload.js';
const SPLASH_PRELOAD_FALLBACK = '../preload/splash-preload.js';

export { DEFAULT_PATHS, PRELOAD_FALLBACK, SPLASH_PRELOAD_FALLBACK };
