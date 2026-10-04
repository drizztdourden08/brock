/* @layer renderer-shell @kind logic */
import { hostApi } from '../host/host-api';
import { useJobStore } from './useJobStore';

const jobs = {
  open: (id: string): void => useJobStore.getState().show(id),
  hide: (): void => useJobStore.getState().show(null),
  cancel: (id: string): void => hostApi()?.cancelJob(id),
  dismiss: (id: string): void => {
    hostApi()?.dismissJob(id);
    useJobStore.getState().remove(id);
  },
  get: (id: string) => useJobStore.getState().jobs[id] ?? null,
};

export { jobs };
