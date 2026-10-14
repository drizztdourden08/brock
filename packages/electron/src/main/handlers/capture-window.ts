/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { assertSafeName } from '@drizztdourden08/brock-core/storage';
import { getUserDataPath } from '../paths/get-user-data-path';
import { captureFrame } from './capture-frame';

const captureWindow = async (win: BrowserWindow, name: string): Promise<string> => {
  const fileName = `${assertSafeName(name, 'screenshot name')}.png`;
  const png = await captureFrame(win.webContents);
  const dir = getUserDataPath('screenshots');
  await mkdir(dir, { recursive: true });
  const outPath = join(dir, fileName);
  await writeFile(outPath, png);
  return outPath;
};

export { captureWindow };
