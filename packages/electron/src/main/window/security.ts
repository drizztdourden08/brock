/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import type { SecurityOptions } from '../types/main-context.type';
import { DEFAULT_PERMISSIONS } from './security.constants';
import { externalProtocols } from './external-protocols';
import { openExternal } from './open-external';

const applyWindowSecurity = (win: BrowserWindow, options: SecurityOptions = {}): void => {
  if (options.externalProtocols) externalProtocols.allowed = new Set(options.externalProtocols);
  const permissions = new Set(options.permissions ?? DEFAULT_PERMISSIONS);

  win.webContents.setWindowOpenHandler(({ url }) => {
    void openExternal(url);
    return { action: 'deny' };
  });

  const { session } = win.webContents;
  session.setPermissionCheckHandler((_wc, permission) => permissions.has(permission));
  session.setPermissionRequestHandler((_wc, permission, callback) => {
    callback(permissions.has(permission));
  });
};

export { applyWindowSecurity };
