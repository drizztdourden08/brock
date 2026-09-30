/* @layer electron-main @kind logic */
import { app } from 'electron';
import { existsSync } from 'fs';
import { basename, dirname, isAbsolute, join, resolve } from 'path';
import type { BootstrapPaths } from '../types/main-context.type';
import type { ResolvedPaths } from '../window/window-setup.type';
import { DEFAULT_PATHS, PRELOAD_FALLBACK, SPLASH_PRELOAD_FALLBACK } from './resolve-paths.constants';

const mainScriptDir = (): string => {
  const appPath = app.getAppPath();
  const isScriptDir = basename(appPath) === 'electron' && basename(dirname(appPath)) === 'dist';
  return isScriptDir ? appPath : join(appPath, 'dist', 'electron');
};

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
