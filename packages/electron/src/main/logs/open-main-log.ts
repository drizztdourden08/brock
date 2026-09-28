/* @layer electron-main @kind logic */
import { mkdirSync, writeFileSync } from 'fs';
import { dirname } from 'path';
import { mainLogPath } from './main-log-path';
import { mainLogBuffer } from './main-log-buffer';

const createLogFile = (content: string): boolean => {
  try {
    mkdirSync(dirname(mainLogPath()), { recursive: true });
    writeFileSync(mainLogPath(), content, 'utf-8');
    return true;
  } catch {
    return false;
  }
};

const openMainLog = (): boolean => {
  if (mainLogBuffer.isOpen) return true;
  mainLogBuffer.isOpen = true;
  const { pending } = mainLogBuffer;
  const created = createLogFile(pending.length ? `${pending.join('\n')}\n` : '');
  pending.length = 0;
  return created;
};

export { openMainLog };
