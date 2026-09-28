/* @layer renderer-shell @kind logic */
import type { FrameLoop, FrameLoopOptions } from './frame.type';
import { MAX_CATCH_UP_STEPS } from './frame.constants';

const createFrameLoop = ({ fps, step, afterSteps }: FrameLoopOptions): FrameLoop => {
  const stepMs = 1000 / fps;
  let handle: number | null = null;
  let last = 0;
  let owed = 0;

  const tick = (now: number): void => {
    owed = Math.min(owed + (now - last), stepMs * MAX_CATCH_UP_STEPS);
    last = now;
    let stepped = false;
    while (owed >= stepMs) {
      step();
      owed -= stepMs;
      stepped = true;
    }
    if (stepped) afterSteps?.();
    handle = requestAnimationFrame(tick);
  };

  const start = (): void => {
    if (handle !== null) return;
    last = performance.now();
    owed = 0;
    handle = requestAnimationFrame(tick);
  };

  const stop = (): void => {
    if (handle !== null) cancelAnimationFrame(handle);
    handle = null;
  };

  return { start, stop, isRunning: () => handle !== null };
};

export { createFrameLoop };
