/* @layer renderer-shell @kind logic */
import { marksWriteQueue } from './marks-write-queue';

const flushTrackerMarks = (): Promise<void> => marksWriteQueue.tail;

export { flushTrackerMarks };
