/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import { displayApi } from '../../display-api';
import { useDisplayStore } from '../../useDisplayStore';
import { useRefreshRateStore } from '../../useRefreshRateStore';

const useDisplayWatch = (): void => {
  const refreshDisplay = useDisplayStore((s) => s.refresh);
  const refreshRate = useRefreshRateStore((s) => s.refresh);

  useEffect(() => {
    const api = displayApi();
    if (!api) return undefined;
    void refreshDisplay();
    return api.onChanged(() => {
      void refreshDisplay();
      void refreshRate();
    });
  }, [refreshDisplay, refreshRate]);
};

export { useDisplayWatch };
