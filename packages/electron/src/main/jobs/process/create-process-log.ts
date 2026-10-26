/* @layer electron-main @kind logic */
import { closeSync, mkdirSync, openSync, writeSync } from 'fs';
import { join } from 'path';
import { PROCESS_LOG_KEEP } from './process-job.constants';
import type { ProcessLog, ProcessLogInput } from './process-job.type';
import { processLogName } from './process-log-name';
import { pruneProcessLogs } from './prune-process-logs';

interface Held {
  text: string;
  bytes: number;
}

interface LogState {
  fd: number | null;
  path: string | undefined;
  broken: boolean;
  closed: boolean;
  headBytes: number;
  headFull: boolean;
  tailBytes: number;
}

const createProcessLog = ({ dir, id, maxBytes }: ProcessLogInput): ProcessLog => {
  const headBudget = Math.ceil(maxBytes / 2);
  const tailBudget = maxBytes - headBudget;
  const tail: Held[] = [];
  const omitted = { lines: 0, bytes: 0 };
  const state: LogState = { fd: null, path: undefined, broken: false, closed: false, headBytes: 0, headFull: false, tailBytes: 0 };

  const open = (): void => {
    try {
      mkdirSync(dir, { recursive: true });
      pruneProcessLogs(dir, PROCESS_LOG_KEEP - 1);
      const path = join(dir, processLogName(id, new Date()));
      state.fd = openSync(path, 'w');
      state.path = path;
    } catch {
      state.broken = true;
    }
  };

  const put = (text: string): void => {
    if (state.fd === null || state.broken) return;
    try {
      writeSync(state.fd, text);
    } catch {
      state.broken = true;
    }
  };

  const hold = (text: string, bytes: number): void => {
    tail.push({ text, bytes });
    state.tailBytes += bytes;
    while (state.tailBytes > tailBudget && tail.length > 0) {
      const gone = tail.shift() as Held;
      state.tailBytes -= gone.bytes;
      omitted.lines += 1;
      omitted.bytes += gone.bytes;
    }
  };

  const write = (line: string): void => {
    if (state.closed || state.broken) return;
    if (state.fd === null) open();
    if (state.broken) return;
    const text = `${line}\n`;
    const bytes = Buffer.byteLength(text);
    if (!state.headFull && state.headBytes + bytes <= headBudget) {
      state.headBytes += bytes;
      put(text);
      return;
    }
    state.headFull = true;
    hold(text, bytes);
  };

  const close = (): string | undefined => {
    if (state.closed) return state.path;
    state.closed = true;
    if (state.fd === null) return undefined;
    if (omitted.lines > 0) put(`[${String(omitted.lines)} lines (${String(omitted.bytes)} bytes) omitted from the middle of the log]\n`);
    for (const held of tail) put(held.text);
    try {
      closeSync(state.fd);
    } catch {
      state.broken = true;
    }
    return state.path;
  };

  return { write, close };
};

export { createProcessLog };
