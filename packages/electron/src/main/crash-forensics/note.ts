/* @layer electron-main @kind logic */
import type { MainLogLevel } from '../logs/main-log-file.type';
import type { NoteOptions } from './forensics-log.type';
import { appendMainLog } from '../logs/append-main-log';
import { appendMainLogSync } from '../logs/append-main-log-sync';
import { TAG } from './forensics-log.constants';

const writeTerminal = (level: MainLogLevel, line: string): void => {
  const stream = level === 'error' || level === 'warn' ? process.stderr : process.stdout;
  try {
    if (stream.writable) stream.write(`${line}\n`);
  } catch (err) {
    appendMainLog('warn', `${TAG} terminal write failed: ${String(err)}`);
  }
};

const note = (level: MainLogLevel, message: string, options: NoteOptions = {}): void => {
  const { sync = false, terminal = true } = options;
  const line = `${TAG} ${message}`;
  if (terminal) writeTerminal(level, line);
  if (sync) appendMainLogSync(level, line);
  else appendMainLog(level, line);
};

export { note };
