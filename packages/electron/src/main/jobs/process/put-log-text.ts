/* @layer electron-main @kind logic */
import { writeSync } from 'fs';
import type { LogState } from './create-process-log.type';

const putLogText = (state: LogState, text: string): void => {
  if (state.fd === null || state.broken) return;
  try {
    writeSync(state.fd, text);
  } catch {
    state.broken = true;
  }
};

export { putLogText };
