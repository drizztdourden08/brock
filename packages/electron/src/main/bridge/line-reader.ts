/* @layer electron-main @kind logic */
import { BRIDGE_NEWLINE } from './bridge.constants';

const createLineReader = (maxBytes: number, onLine: (line: string) => void, onOverflow: () => void): ((chunk: Buffer) => void) => {
  const state = { parts: [] as Buffer[], size: 0, stopped: false };
  const stop = (): void => {
    state.stopped = true;
    state.parts = [];
    onOverflow();
  };
  const take = (head: Buffer): boolean => {
    const line = Buffer.concat([...state.parts, head]);
    state.parts = [];
    state.size = 0;
    if (line.length > maxBytes) return false;
    if (line.length > 0) onLine(line.toString('utf8'));
    return true;
  };
  return (chunk) => {
    if (state.stopped) return;
    let rest = chunk;
    for (let at = rest.indexOf(BRIDGE_NEWLINE); at !== -1; at = rest.indexOf(BRIDGE_NEWLINE)) {
      if (!take(rest.subarray(0, at))) {
        stop();
        return;
      }
      rest = rest.subarray(at + 1);
    }
    state.size += rest.length;
    if (state.size > maxBytes) stop();
    else if (rest.length > 0) state.parts.push(rest);
  };
};

export { createLineReader };
