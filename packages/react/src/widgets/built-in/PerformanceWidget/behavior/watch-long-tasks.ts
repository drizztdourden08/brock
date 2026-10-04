/* @layer renderer-shell @kind logic */
import type { TaskCounter } from '../PerformanceWidget.type';

const watchLongTasks = (tasks: TaskCounter): (() => void) => {
  const supported = typeof PerformanceObserver !== 'undefined' && PerformanceObserver.supportedEntryTypes.includes('longtask');
  if (!supported) return () => undefined;
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      tasks.count += 1;
      tasks.totalMs += entry.duration;
    }
  });
  observer.observe({ type: 'longtask' });
  return () => observer.disconnect();
};

export { watchLongTasks };
