/* @layer electron-main @kind logic */
import { appendFileSync } from 'fs';
import type { MainLogLevel } from './main-log-file.type';
import { mainLogPath } from './main-log-path';
import { formatMainLogLine } from './format-main-log-line';
import { isMainLogReady } from './is-main-log-ready';
import { mainLogBuffer } from './main-log-buffer';
import { openMainLog } from './open-main-log';

const appendMainLogSync = (level: MainLogLevel, message: string): boolean => {
  const line = formatMainLogLine(level, message);
  if (!isMainLogReady()) {
    mainLogBuffer.hold(line);
    return false;
  }
  openMainLog();
  try {
    appendFileSync(mainLogPath(), `${line}\n`, 'utf-8');
    return true;
  } catch {
    return false;
  }
};

export { appendMainLogSync };
