/* @layer electron-main @kind logic */
import { LIST_BUSY } from './list-limits.constants';

const createListGate = (maxWaiting: number): (<T>(work: () => Promise<T>) => Promise<T>) => {
  let busy = false;
  const waiting: (() => void)[] = [];
  return async (work) => {
    if (!busy) busy = true;
    else if (waiting.length >= maxWaiting) throw new Error(LIST_BUSY);
    else await new Promise<void>((turn) => waiting.push(turn));
    try {
      return await work();
    } finally {
      const next = waiting.shift();
      if (next) next();
      else busy = false;
    }
  };
};

export { createListGate };
