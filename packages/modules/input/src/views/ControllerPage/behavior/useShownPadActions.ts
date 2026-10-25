/* @layer renderer-components @kind hook */
import { useMemo } from 'react';
import type { DeviceEntry } from '../../../device.type';
import type { ShownDeviceCardAction } from '../../../renderer/device-card-action.type';
import { shownDeviceCardActions } from '../../../renderer/shown-device-card-actions';
import { useDeviceCardActionStore } from '../../../renderer/useDeviceCardActionStore';

const useShownPadActions = (entry: DeviceEntry): ShownDeviceCardAction[] => {
  const groups = useDeviceCardActionStore((state) => state.groups);
  return useMemo(() => shownDeviceCardActions(groups.flat(), [], entry), [groups, entry]);
};

export { useShownPadActions };
