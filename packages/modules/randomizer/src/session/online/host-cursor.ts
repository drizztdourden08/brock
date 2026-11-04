/* @layer core @kind logic */
import type { OnlineHost } from '../../archipelago';
import type { OnlineParts } from './online-parts.type';

const hostCursor = <P, A>({ store }: OnlineParts<P, A>): Pick<OnlineHost, 'readCursor' | 'writeCursor'> => ({
  readCursor() {
    const saved = store.read();
    return saved === null ? null : { index: saved.receivedIndex, roomHash: saved.roomHash };
  },
  writeCursor(cursor) {
    store.write({ receivedIndex: cursor.index, roomHash: cursor.roomHash });
  },
});

export { hostCursor };
