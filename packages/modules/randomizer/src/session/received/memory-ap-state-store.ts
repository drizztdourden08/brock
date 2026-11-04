/* @layer core @kind logic */
import type { ApStateStore } from './ap-state-store.type';
import type { ReceivedCursor } from './received-cursor.type';

const createMemoryApStateStore = (): ApStateStore => {
  let saved: ReceivedCursor | null = null;
  return {
    read: () => saved,
    write: (s) => {
      saved = { ...s };
    },
  };
};

export { createMemoryApStateStore };
