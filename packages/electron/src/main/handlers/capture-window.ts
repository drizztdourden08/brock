/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import { assertSafeName } from '@drizztdourden08/brock-core/storage';
import { getUserDataPath } from '../paths/get-user-data-path';
import { writeCapture } from './write-capture';

const captureWindow = (win: BrowserWindow, name: string): Promise<string> =>
  writeCapture(win, getUserDataPath('screenshots'), `${assertSafeName(name, 'screenshot name')}.png`);

export { captureWindow };
