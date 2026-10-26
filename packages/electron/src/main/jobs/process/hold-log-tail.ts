/* @layer electron-main @kind logic */
import type { Held, LogState } from './create-process-log.type';

const holdLogTail = (state: LogState, held: Held, budget: number): void => {
  state.tail.push(held);
  state.tailBytes += held.bytes;
  while (state.tailBytes > budget && state.tail.length > 0) {
    const gone = state.tail.shift() as Held;
    state.tailBytes -= gone.bytes;
    state.omittedLines += 1;
    state.omittedBytes += gone.bytes;
  }
};

export { holdLogTail };
