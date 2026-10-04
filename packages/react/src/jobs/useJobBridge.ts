/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import { hostApi } from '../host/host-api';
import { useJobStore } from './useJobStore';

const useJobBridge = (): void => {
  useEffect(() => {
    const api = hostApi();
    if (!api) return undefined;
    const { upsert } = useJobStore.getState();
    let live = true;
    void api.listJobs().then((list) => {
      if (live) for (const job of list) upsert(job);
    });
    const stop = api.onJobUpdate(upsert);
    return () => {
      live = false;
      stop();
    };
  }, []);
};

export { useJobBridge };
