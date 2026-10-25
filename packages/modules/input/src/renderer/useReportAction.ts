/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import type { DeviceEntry } from '../device.type';
import type { DeviceCardAction } from './device-card-action.type';
import { reportActionOf } from './report-action-of';
import { useDeviceCardActionStore } from './useDeviceCardActionStore';

const useReportAction = (entry: DeviceEntry | null): DeviceCardAction | null => {
  const groups = useDeviceCardActionStore((state) => state.groups);
  return useMemo(() => (entry ? reportActionOf(groups.flat(), entry) : null), [groups, entry]);
};

export { useReportAction };
