/* @layer electron-main @kind logic */
import { appendFile } from 'fs/promises';
import type { HandlerGroup } from '../types/main-context.type';
import { currentLogPath } from './session-log-path';

let pendingWrite: Promise<void> = Promise.resolve();

const appendBatch = (lines: string[]): void => {
  if (lines.length === 0) return;
  const chunk = `${lines.join('\n')}\n`;
  pendingWrite = pendingWrite
    .then(() => appendFile(currentLogPath(), chunk, 'utf-8'))
    .catch(() => undefined);
};

const sessionLogHandlers: HandlerGroup = {
  id: 'sessionLog',
  register: ({ on }) => {
    on('debug:appendSessionLog', (_event, lines) => {
      if (!Array.isArray(lines)) return;
      appendBatch(lines.filter((line): line is string => typeof line === 'string'));
    });
  },
};

export { sessionLogHandlers };
