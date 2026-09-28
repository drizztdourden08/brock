/* @layer electron-main @kind logic */
import { appendFile } from 'fs/promises';
import type { MainLogLevel } from './main-log-file.type';
import { mainLogPath } from './main-log-path';
import { formatMainLogLine } from './format-main-log-line';
import { isMainLogReady } from './is-main-log-ready';
import { mainLogBuffer } from './main-log-buffer';
import { openMainLog } from './open-main-log';

const appendMainLog = (level: MainLogLevel, message: string): void => {
  const line = formatMainLogLine(level, message);
  if (!isMainLogReady()) {
    mainLogBuffer.hold(line);
    return;
  }
  openMainLog();
  appendFile(mainLogPath(), `${line}\n`, 'utf-8').catch(() => undefined);
};

export { appendMainLog };
