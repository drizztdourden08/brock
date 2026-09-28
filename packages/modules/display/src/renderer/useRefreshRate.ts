/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import type { RefreshRateInfo } from '../display.type';
import { useRefreshRateStore } from './useRefreshRateStore';

const useRefreshRate = (): RefreshRateInfo => {
  const info = useRefreshRateStore((s) => s.info);
  const refresh = useRefreshRateStore((s) => s.refresh);
  const unread = info.reportedHz === null && info.measuredHz === null;

  useEffect(() => {
    if (unread) void refresh();
  }, [refresh, unread]);

  return info;
};

export { useRefreshRate };
