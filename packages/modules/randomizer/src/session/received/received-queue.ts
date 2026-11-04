/* @layer core @kind logic */
import { createMemoryApStateStore } from './memory-ap-state-store';
import { createReceivedIndex } from './received-index';
import type { ReceivedQueue, ReceivedQueueOptions } from './received-queue.type';
import { markHanded } from './received-queue-mark';
import { receivedQueueIsNew } from './received-queue-is-new';
import { receivedQueueNext } from './received-queue-next';
import { markSettled } from './received-queue-settle';
import { resetReceivedQueue } from './received-queue-reset';
import { createReceivedQueueState } from './received-queue-state';

const createReceivedQueue = (options: ReceivedQueueOptions): ReceivedQueue => {
  const store = options.store ?? createMemoryApStateStore();
  const state = createReceivedQueueState();
  const saved = (): number => createReceivedIndex(store, options.roomHash()).read();

  return {
    state,
    saved,
    epoch: () => state.epoch,
    queued: () => state.queued,
    next: () => receivedQueueNext(state, saved()),
    isNew: (index) => receivedQueueIsNew(state, saved(), index),
    hand: (index) => markHanded(state, index),
    settle(index, epoch) {
      if (epoch !== state.epoch) return false;
      const before = saved();
      const after = markSettled(state, index, before);
      if (after > before) createReceivedIndex(store, options.roomHash()).write(after);
      return true;
    },
    reset: () => resetReceivedQueue(state),
  };
};

export { createReceivedQueue };
