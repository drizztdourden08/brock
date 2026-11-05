/* @layer renderer-shell @kind logic */
import type { FrameLoop, FrameLoopOptions, FrameSchedule } from './frame.type';
import { MAX_CATCH_UP_STEPS } from './frame.constants';
import { driveLoop } from './drive-loop';

const createFrameLoop = ({ fps, step, afterSteps, schedule = 'display' }: FrameLoopOptions): FrameLoop => {
  const stepMs = 1000 / fps;
  let mode: FrameSchedule = schedule;
  let running = false;
  let cancel: (() => void) | null = null;
  let last = 0;
  let owed = 0;

  const advance = (now: number): void => {
    owed = Math.min(owed + (now - last), stepMs * MAX_CATCH_UP_STEPS);
    last = now;
    let stepped = false;
    while (owed >= stepMs) {
      step();
      owed -= stepMs;
      stepped = true;
    }
    if (stepped) afterSteps?.();
  };

  const stop = (): void => {
    cancel?.();
    cancel = null;
    running = false;
  };

  const start = (): void => {
    if (running) return;
    running = true;
    last = performance.now();
    owed = 0;
    cancel = driveLoop(mode, advance);
  };

  const setSchedule = (next: FrameSchedule): void => {
    if (next === mode) return;
    const wasRunning = running;
    stop();
    mode = next;
    if (wasRunning) start();
  };

  return { start, stop, setSchedule, isRunning: () => running };
};

export { createFrameLoop };
