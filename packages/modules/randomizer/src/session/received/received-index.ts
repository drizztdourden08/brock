/* @layer core @kind logic */
import type { ApStateStore } from './ap-state-store.type';
import type { ReceivedIndex } from './received-index.type';

const createReceivedIndex = (store: ApStateStore | undefined, roomHash: string): ReceivedIndex => {
  let fallback = 0;
  return {
    read: () => store?.read()?.receivedIndex ?? fallback,
    write: (index) => {
      fallback = index;
      store?.write({ receivedIndex: index, roomHash: store.read()?.roomHash ?? roomHash });
    },
  };
};

export { createReceivedIndex };
