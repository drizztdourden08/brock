/* @layer electron-main @kind logic */
import { EventEmitter } from 'events';

const changes = new EventEmitter<{ settled: [] }>();
let count = 0;

const setCaptureHolds = (next: number): void => {
  count = Number.isFinite(next) && next > 0 ? Math.floor(next) : 0;
  if (count === 0) changes.emit('settled');
};

const whenCaptureSettled = (): Promise<void> =>
  (count === 0 ? Promise.resolve() : new Promise((resolve) => { changes.once('settled', resolve); }));

const captureHolds = { set: setCaptureHolds, settled: whenCaptureSettled, count: (): number => count };

export { captureHolds };
