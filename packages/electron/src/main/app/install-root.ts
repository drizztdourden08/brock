/* @layer electron-main @kind logic */
import { app } from 'electron';
import { existsSync } from 'fs';
import { dirname, join } from 'path';

const installRoot = (): string | null => {
  if (!app.isPackaged) return null;
  const root = dirname(dirname(app.getPath('exe')));
  return existsSync(join(root, 'Update.exe')) ? root : null;
};

export { installRoot };
