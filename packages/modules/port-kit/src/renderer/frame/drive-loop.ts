/* @layer renderer-shell @kind logic */
import type { FrameSchedule } from './frame.type';
import { TIMER_PERIOD_MS } from './frame.constants';
import { nextTimerDue } from './next-timer-due';

const driveDisplay = (advance: (now: number) => void, hold: { cancel: () => void }): void => {
  const arm = (): void => {
    const handle = requestAnimationFrame((now) => {
      advance(now);
      arm();
    });
    hold.cancel = () => cancelAnimationFrame(handle);
  };
  arm();
};

const driveTimer = (advance: (now: number) => void, hold: { cancel: () => void }): void => {
  let due = performance.now() + TIMER_PERIOD_MS;
  const arm = (): void => {
    const handle = setTimeout(() => {
      const now = performance.now();
      advance(now);
      due = nextTimerDue(due, now);
      arm();
    }, Math.max(0, due - performance.now()));
    hold.cancel = () => clearTimeout(handle);
  };
  arm();
};

const driveLoop = (mode: FrameSchedule, advance: (now: number) => void): (() => void) => {
  const hold = { cancel: (): void => {} };
  if (mode === 'timer') driveTimer(advance, hold);
  else driveDisplay(advance, hold);
  return () => hold.cancel();
};

export { driveLoop };
