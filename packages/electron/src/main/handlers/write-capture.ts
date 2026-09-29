/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

const writeCapture = async (win: BrowserWindow, dir: string, fileName: string): Promise<string> => {
  const image = await win.webContents.capturePage();
  await mkdir(dir, { recursive: true });
  const outPath = join(dir, fileName);
  await writeFile(outPath, image.toPNG());
  return outPath;
};

export { writeCapture };
