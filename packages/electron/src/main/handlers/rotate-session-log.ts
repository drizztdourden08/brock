/* @layer electron-main @kind logic */
import { mkdir, rename, rm, writeFile } from 'fs/promises';
import { dirname } from 'path';
import { getUserDataPath } from '../paths/get-user-data-path';
import { appendMainLog } from '../logs/append-main-log';
import { currentLogPath } from './session-log-path';

const previousLogPath = (): string => getUserDataPath('debug', 'session-1.log');

const rotateSessionLog = async (): Promise<void> => {
  try {
    await mkdir(dirname(currentLogPath()), { recursive: true });
    await rm(previousLogPath(), { force: true });
    await rename(currentLogPath(), previousLogPath()).catch(() => undefined);
    await writeFile(currentLogPath(), `[${new Date().toISOString()}] [info] [app] session log started\n`, 'utf-8');
  } catch (err) {
    appendMainLog('warn', `[session-log] rotation failed: ${String(err)}`);
  }
};

export { rotateSessionLog };
