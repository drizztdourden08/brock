/* @layer electron-main @kind logic */
import { EventEmitter } from 'events';
import { CAPTURE_STABLE_MS, MAIN_SOURCE } from './capture-holds.constants';

const changes = new EventEmitter<{ settled: [] }>();
const counts = new Map<number, number>();

const total = (): number => [...counts.values()].reduce((sum, each) => sum + each, 0);

const changed = (): void => {
  if (total() === 0) changes.emit('settled');
};

const setCaptureHolds = (next: number, source = MAIN_SOURCE): void => {
  const count = Number.isFinite(next) && next > 0 ? Math.floor(next) : 0;
  if (count === 0) counts.delete(source);
  else counts.set(source, count);
  changed();
};

const dropSource = (source: number): void => {
  if (counts.delete(source)) changed();
};

const whenCaptureSettled = (): Promise<void> =>
  (total() === 0 ? Promise.resolve() : new Promise((resolve) => { changes.once('settled', resolve); }));

const pause = (ms: number): Promise<void> => new Promise((resolve) => { setTimeout(resolve, ms); });

const whenCaptureStable = async (): Promise<void> => {
  await whenCaptureSettled();
  await pause(CAPTURE_STABLE_MS);
  if (total() > 0) await whenCaptureStable();
};

const settledWithin = (timeoutMs: number): Promise<boolean> => new Promise((resolve) => {
  const timer = setTimeout(() => resolve(false), timeoutMs);
  void whenCaptureStable().then(() => {
    clearTimeout(timer);
    resolve(true);
  });
});

const captureHolds = {
  set: setCaptureHolds,
  drop: dropSource,
  stable: whenCaptureStable,
  settledWithin,
  count: total,
};

export { captureHolds };
