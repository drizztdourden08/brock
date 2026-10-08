/* @layer electron-main @kind logic */
import { join } from 'path';

const systemTar = (platform: NodeJS.Platform = process.platform): string =>
  (platform === 'win32' ? join(process.env.SystemRoot ?? 'C:\\Windows', 'System32', 'tar.exe') : 'tar');

export { systemTar };
