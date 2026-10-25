/* @layer renderer-shell @kind hook */
import { useEffect, useRef } from 'react';
import type { ControllerDeviceGroup } from '../runtime/controller-device-groups.type';
import { holdAwareGroups } from '../runtime/hold-aware-groups';
import { useHoldReleased } from './useHoldReleased';

const useHoldAwareGroups = (live: readonly ControllerDeviceGroup[]) => {
  const released = useHoldReleased();
  const lastKnown = useRef<readonly ControllerDeviceGroup[]>(live);

  useEffect(() => {
    if (!released && live.length > 0) lastKnown.current = live;
  }, [live, released]);

  return { groups: holdAwareGroups(live, lastKnown.current, released), released };
};

export { useHoldAwareGroups };
