/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { assertSafeName } from '@drizztdourden08/brock-core/storage';
import { getUserDataPath } from '../paths/get-user-data-path';

const captureWindow = async (win: BrowserWindow, name: string): Promise<string> => {
  const safe = assertSafeName(name, 'screenshot name');
  const image = await win.webContents.capturePage();
  const dir = getUserDataPath('screenshots');
  await mkdir(dir, { recursive: true });
  const outPath = join(dir, `${safe}.png`);
  await writeFile(outPath, image.toPNG());
  return outPath;
};

export { captureWindow };
