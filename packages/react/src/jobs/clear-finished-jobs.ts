/* @layer renderer-shell @kind logic */
import { jobs } from './jobs';
import { DONE_JOB_CLEAR_MS } from './jobs.constants';
import { useJobStore } from './useJobStore';

const clearIfStillDone = (id: string): void => {
  const { jobs: all, shown } = useJobStore.getState();
  if (all[id]?.state === 'done' && shown !== id) jobs.dismiss(id);
};

const clearFinishedJobs = (): (() => void) => {
  const timers = new Map<string, ReturnType<typeof setTimeout>>();
  const schedule = (): void => {
    for (const job of Object.values(useJobStore.getState().jobs)) {
      if (job.state !== 'done' || timers.has(job.id)) continue;
      const wait = Math.max(0, (job.endedAt ?? Date.now()) + DONE_JOB_CLEAR_MS - Date.now());
      timers.set(job.id, setTimeout(() => {
        timers.delete(job.id);
        clearIfStillDone(job.id);
      }, wait));
    }
  };
  schedule();
  const stop = useJobStore.subscribe((state, prev) => {
    if (state.jobs !== prev.jobs || state.shown !== prev.shown) schedule();
  });
  return () => {
    stop();
    for (const timer of timers.values()) clearTimeout(timer);
    timers.clear();
  };
};

export { clearFinishedJobs };
