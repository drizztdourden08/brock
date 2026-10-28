/* @layer electron-main @kind logic */
import type { ReviewWatchdog, ReviewWatchdogOptions, ReviewWatchdogTrip } from './review-watchdog.type';

const createReviewWatchdog = ({ startMs, idleMs, bootCapMs, stepMaxMs, onTrip }: ReviewWatchdogOptions): ReviewWatchdog => {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let cap: ReturnType<typeof setTimeout> | null = null;
  let running = false;
  let limitMs = idleMs;
  let stopped = false;

  const clearTimer = (): void => {
    if (timer) clearTimeout(timer);
    timer = null;
  };
  const clearCap = (): void => {
    if (cap) clearTimeout(cap);
    cap = null;
  };
  const trip = (outcome: ReviewWatchdogTrip): void => {
    if (stopped) return;
    stop();
    onTrip(outcome);
  };
  const arm = (kind: ReviewWatchdogTrip['kind'], ms: number): void => {
    clearTimer();
    timer = setTimeout(() => trip({ kind, ms }), ms);
  };
  const stop = (): void => {
    stopped = true;
    clearTimer();
    clearCap();
  };

  arm('silent-boot', startMs);
  cap = setTimeout(() => trip({ kind: 'boot-cap', ms: bootCapMs }), bootCapMs);

  return {
    bootActivity: () => {
      if (!running && !stopped) arm('silent-boot', startMs);
    },
    working: (stepLimitMs) => {
      if (stopped) return;
      if (stepLimitMs === null) limitMs = idleMs;
      else if (stepLimitMs !== undefined && Number.isFinite(stepLimitMs) && stepLimitMs > 0) limitMs = Math.min(stepLimitMs, stepMaxMs);
      if (!running) {
        running = true;
        clearCap();
      }
      arm('idle', limitMs);
    },
    stop,
  };
};

export { createReviewWatchdog };
