/* @layer renderer-shell @kind hook */
import { useEffect, useMemo } from 'react';
import type { PadState } from '../pad/controller-slot.type';
import { padStateOf } from '../pad/pad-state-of';
import { useControllerDevicesStore } from './useControllerDevicesStore';
import { useControllerState } from './useControllerState';

const usePadState = (deviceKey: string): PadState => {
  const { buttons, axes } = useControllerState(deviceKey);
  const device = useControllerDevicesStore((s) => s.entries.find((entry) => entry.deviceKey === deviceKey));
  const loaded = useControllerDevicesStore((s) => s.loaded);
  const refresh = useControllerDevicesStore((s) => s.refresh);
  useEffect(() => { if (!loaded) void refresh(); }, [loaded, refresh]);
  return useMemo(() => padStateOf(buttons, axes, device), [buttons, axes, device]);
};

export { usePadState };
