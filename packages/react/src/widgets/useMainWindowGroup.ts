/* @layer renderer-shell @kind hook */
import { useCallback, useEffect, useState } from 'react';
import type { WidgetWindowGroup } from '@drizztdourden08/brock-core';
import { hostApi } from '../host/host-api';

const useMainWindowGroup = () => {
  const [group, setLocal] = useState<WidgetWindowGroup | null>(null);

  useEffect(() => {
    const api = hostApi();
    if (!api) return undefined;
    let live = true;
    void Promise.resolve(api.getMainWindowGroup()).then((current) => {
      if (live) setLocal(current ?? null);
    });
    const off = api.onMainWindowGroup((next) => setLocal(next));
    return () => {
      live = false;
      off();
    };
  }, []);

  const setGroup = useCallback((next: WidgetWindowGroup | null) => hostApi()?.setMainWindowGroup(next), []);

  return { group, setGroup };
};

export { useMainWindowGroup };
