/* @layer renderer-shell @kind logic */
import type { ControllerDeviceGroup } from './controller-device-groups.type';

const holdAwareGroups = (
  live: readonly ControllerDeviceGroup[],
  lastKnown: readonly ControllerDeviceGroup[],
  released: boolean,
): readonly ControllerDeviceGroup[] => (released && live.length === 0 ? lastKnown : live);

export { holdAwareGroups };
