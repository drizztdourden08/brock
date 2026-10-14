/* @layer electron-main @kind logic */
import { execFile } from 'child_process';
import { existsSync } from 'fs';
import { promisify } from 'util';
import { app } from 'electron';
import type { InstallSize } from './updater-main.type';
import { createInstallSize } from './create-install-size';
import { installLocation } from './install-location';

const run = promisify(execFile);

const installSizeOf = (appId: string): InstallSize => {
  const location = app.isPackaged
    ? installLocation({ platform: process.platform, execPath: process.execPath, appId, appImage: process.env.APPIMAGE, exists: existsSync })
    : null;
  return createInstallSize(location, (file, args) => run(file, [...args], { windowsHide: true }));
};

export { installSizeOf };
