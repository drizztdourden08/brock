/* @layer renderer-shell @kind logic */
import type { FrameCounter } from '../PerformanceWidget.type';

const countFrame = (counter: FrameCounter, now: number): void => {
  if (counter.last !== null) {
    const gap = now - counter.last;
    counter.frames += 1;
    counter.totalMs += gap;
    counter.worstMs = Math.max(counter.worstMs, gap);
  }
  counter.last = now;
};

export { countFrame };
