/* @layer electron-main @kind logic */
import { formatMainLogLine } from '../main/logs/format-main-log-line';
import type { ServerLog } from './server-host.type';
import type { LogSink } from './stdout-log.type';

const createStdoutLog = (out: LogSink, err: LogSink): ServerLog => (message, level = 'info') => {
  const sink = level === 'error' ? err : out;
  sink.write(`${formatMainLogLine(level, message)}\n`);
};

export { createStdoutLog };
