/* @layer electron-main @kind logic */
import { isAbsolute, join } from 'path';
import { existsSync } from 'fs';
import { app } from 'electron';
import type { ProductIcons } from '@drizztdourden08/brock-core/product';
import { appendMainLog } from '../logs/append-main-log';

const candidates = (icons: ProductIcons): (string | undefined)[] =>
  process.platform === 'win32'
    ? [icons.ico, icons.png256, icons.png512]
    : [icons.png256, icons.png512];

const absolute = (path: string): string => (isAbsolute(path) ? path : join(app.getAppPath(), path));

const firstExisting = (icons: ProductIcons): string | undefined => {
  for (const candidate of candidates(icons)) {
    if (!candidate) continue;
    const path = absolute(candidate);
    if (existsSync(path)) return path;
  }
  return undefined;
};

const resolveWindowIcon = (
  icons: ProductIcons,
  instanceName: string | null,
  instanceIcons?: ProductIcons,
): string | undefined => {
  if (instanceName && instanceIcons) {
    const own = firstExisting(instanceIcons);
    if (own) return own;
    appendMainLog('warn', '[instance] No instance icon found. Using the product icon.');
  }
  return firstExisting(icons);
};

export { resolveWindowIcon };
