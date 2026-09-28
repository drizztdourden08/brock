/* @layer renderer-shell @kind logic */
import { SAMPLE_FRAMES, WARMUP_FRAMES } from './refresh-rate.constants';

const median = (values: number[]): number => {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const upper = sorted[mid] ?? 0;
  return sorted.length % 2 ? upper : ((sorted[mid - 1] ?? upper) + upper) / 2;
};

const measureRefreshRate = (): Promise<number | null> => new Promise((resolve) => {
  const intervals: number[] = [];
  let previous = 0;
  let seen = 0;
  const tick = (time: number): void => {
    seen++;
    if (seen > WARMUP_FRAMES && previous) intervals.push(time - previous);
    previous = time;
    if (intervals.length < SAMPLE_FRAMES) {
      requestAnimationFrame(tick);
      return;
    }
    const ms = median(intervals);
    resolve(ms > 0 ? 1000 / ms : null);
  };
  requestAnimationFrame(tick);
});

export { measureRefreshRate };
