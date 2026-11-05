/* @layer core @kind logic */
import type { FakeCore } from './fake-core.type';
import type { FakeCorePlay } from './fake-core-play.type';

const fakeCorePlay = (self: () => FakeCore): FakeCorePlay => {
  const swapListeners = new Set<() => void>();
  const swap = (): void => { for (const listener of [...swapListeners]) listener(); };
  return {
    isFileInPlay: () => self().inPlay,
    onSaveSwap: (listener) => {
      swapListeners.add(listener);
      return () => swapListeners.delete(listener);
    },
    setInPlay: (inPlay) => {
      self().inPlay = inPlay;
      swap();
    },
    swapSave: swap,
    readReceivedIndex: () => self().index,
    writeReceivedIndex: (index) => { self().index = index; },
    readRoomHash: () => self().roomHash,
    writeRoomHash: (hash) => { self().roomHash = hash; },
  };
};

export { fakeCorePlay };
