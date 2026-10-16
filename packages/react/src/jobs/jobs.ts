/* @layer renderer-shell @kind logic */
import type { StartJob } from '@drizztdourden08/brock-core/jobs';
import { hostApi } from '../host/host-api';
import { rendererJobs } from './renderer-jobs';
import { useJobStore } from './useJobStore';

const isRendererJob = (id: string): boolean => rendererJobs.list().some((job) => job.id === id);

const start: StartJob = (id, steps, options) => rendererJobs.start(id, steps, options);

const jobs = {
  start,
  open: (id: string): void => useJobStore.getState().show(id),
  hide: (): void => useJobStore.getState().show(null),
  cancel: (id: string): void => {
    if (isRendererJob(id)) rendererJobs.cancel(id);
    else hostApi()?.cancelJob(id);
  },
  dismiss: (id: string): void => {
    if (isRendererJob(id)) rendererJobs.dismiss(id);
    else hostApi()?.dismissJob(id);
    useJobStore.getState().remove(id);
  },
  get: (id: string) => useJobStore.getState().jobs[id] ?? null,
};

export { jobs };
