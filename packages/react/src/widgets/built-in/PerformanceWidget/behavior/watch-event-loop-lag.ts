/* @layer renderer-shell @kind logic */
import { LAG_PROBE_MS } from '../PerformanceWidget.constants';
import type { TaskCounter } from '../PerformanceWidget.type';

const watchEventLoopLag = (tasks: TaskCounter): (() => void) => {
  let expected = performance.now() + LAG_PROBE_MS;
  const timer = setInterval(() => {
    const now = performance.now();
    tasks.lagMs = Math.max(tasks.lagMs, now - expected);
    expected = now + LAG_PROBE_MS;
  }, LAG_PROBE_MS);
  return () => clearInterval(timer);
};

export { watchEventLoopLag };
