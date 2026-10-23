/* @layer electron-main @kind logic */
import { existsSync } from 'fs';
import { isAbsolute, resolve } from 'path';
import type { BootstrapPaths } from '../types/main-context.type';
import type { ResolvedPaths } from '../window/window-setup.type';
import { DEFAULT_PATHS, PRELOAD_FALLBACK, SPLASH_PRELOAD_FALLBACK } from './resolve-paths.constants';
import { mainScriptDir } from './main-script-dir';

const resolvePaths = (paths: BootstrapPaths = {}): ResolvedPaths => {
  const base = mainScriptDir();
  const absolute = (path: string): string => (isAbsolute(path) ? path : resolve(base, path));
  const firstPresent = (preferred: string, fallback: string): string => (existsSync(absolute(preferred)) ? preferred : fallback);
  return {
    preload: absolute(paths.preload ?? firstPresent(DEFAULT_PATHS.preload, PRELOAD_FALLBACK)),
    renderer: absolute(paths.renderer ?? DEFAULT_PATHS.renderer),
    splash: absolute(paths.splash ?? DEFAULT_PATHS.splash),
    splashPreload: absolute(paths.splashPreload ?? firstPresent(DEFAULT_PATHS.splashPreload, SPLASH_PRELOAD_FALLBACK)),
  };
};

export { resolvePaths };
