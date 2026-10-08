/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import { hostApi } from '../host/host-api';
import { appOpen } from './app-open';

const useAppOpenBridge = (): void => {
  useEffect(() => {
    const api = hostApi();
    if (!api || typeof api.takeOpenRequests !== 'function') return undefined;
    let live = true;
    const stop = api.onAppOpen(appOpen.dispatch);
    void api.takeOpenRequests().then((requests) => {
      if (live) for (const request of requests) appOpen.dispatch(request);
    });
    return () => {
      live = false;
      stop();
    };
  }, []);
};

export { useAppOpenBridge };
