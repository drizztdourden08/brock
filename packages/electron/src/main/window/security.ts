/* @layer electron-main @kind logic */
import { shell } from 'electron';
import type { BrowserWindow } from 'electron';
import type { SecurityOptions } from '../types/main-context.type';
import { DEFAULT_EXTERNAL_PROTOCOLS, DEFAULT_PERMISSIONS } from './security.constants';

const protocolOf = (url: string): string | null => {
  try { return new URL(url).protocol; } catch { return null; }
};

const applyWindowSecurity = (win: BrowserWindow, options: SecurityOptions = {}): void => {
  const protocols = new Set(options.externalProtocols ?? DEFAULT_EXTERNAL_PROTOCOLS);
  const permissions = new Set(options.permissions ?? DEFAULT_PERMISSIONS);

  win.webContents.setWindowOpenHandler(({ url }) => {
    const protocol = protocolOf(url);
    if (protocol && protocols.has(protocol)) void shell.openExternal(url);
    return { action: 'deny' };
  });

  const { session } = win.webContents;
  session.setPermissionCheckHandler((_wc, permission) => permissions.has(permission));
  session.setPermissionRequestHandler((_wc, permission, callback) => {
    callback(permissions.has(permission));
  });
};

export { applyWindowSecurity };
