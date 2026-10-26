/* @layer electron-main @kind logic */
import { closeSync } from 'fs';
import type { LogState } from './create-process-log.type';
import { holdLogTail } from './hold-log-tail';
import { openLogFile } from './open-log-file';
import type { ProcessLog, ProcessLogInput } from './process-job.type';
import { putLogText } from './put-log-text';

const createProcessLog = ({ dir, id, maxBytes }: ProcessLogInput): ProcessLog => {
  const headBudget = Math.ceil(maxBytes / 2);
  const tailBudget = maxBytes - headBudget;
  const state: LogState = {
    fd: null, path: undefined, broken: false, closed: false, headBytes: 0, headFull: false, tail: [], tailBytes: 0, omittedLines: 0, omittedBytes: 0,
  };

  const write = (line: string): void => {
    if (state.closed || state.broken) return;
    if (state.fd === null && !openLogFile(state, dir, id)) return;
    const text = `${line}\n`;
    const bytes = Buffer.byteLength(text);
    if (!state.headFull && state.headBytes + bytes <= headBudget) {
      state.headBytes += bytes;
      putLogText(state, text);
      return;
    }
    state.headFull = true;
    holdLogTail(state, { text, bytes }, tailBudget);
  };

  const close = (): string | undefined => {
    if (state.closed) return state.path;
    state.closed = true;
    if (state.fd === null) return undefined;
    if (state.omittedLines > 0) putLogText(state, `[${String(state.omittedLines)} lines (${String(state.omittedBytes)} bytes) omitted from the middle of the log]\n`);
    for (const held of state.tail) putLogText(state, held.text);
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
