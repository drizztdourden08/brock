/* @layer electron-main @kind logic */
import { join } from 'path';
import { APP_ICON_STEM, INSTANCE_ICON_STEM } from './window-icon.constants';
import type { WindowIconQuery, WindowIconResult } from './window-icon.type';

const fileNames = (platform: NodeJS.Platform, stem: string): string[] =>
  platform === 'win32' ? [`${stem}.ico`, `${stem}-256.png`] : [`${stem}-256.png`];

const firstExisting = (query: WindowIconQuery, stem: string): string | undefined => {
  const { dirs, platform, exists } = query;
  for (const dir of dirs) {
    for (const name of fileNames(platform, stem)) {
      const path = join(dir, name);
      if (exists(path)) return path;
    }
  }
  return undefined;
};

const findWindowIcon = (query: WindowIconQuery): WindowIconResult => {
  const { dirs, instanceName } = query;
  const warnings: string[] = [];
  if (instanceName) {
    const own = firstExisting(query, INSTANCE_ICON_STEM);
    if (own) return { path: own, warnings };
    warnings.push(`[instance] No ${INSTANCE_ICON_STEM} icon in ${dirs.join(', ')}. Using the app icon.`);
  }
  const path = firstExisting(query, APP_ICON_STEM);
  if (!path) warnings.push(`[window] No ${APP_ICON_STEM} icon in ${dirs.join(', ')}. The window has no icon.`);
  return { path, warnings };
};

export { findWindowIcon };
