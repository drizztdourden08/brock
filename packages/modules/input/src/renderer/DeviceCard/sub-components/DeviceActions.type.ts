/* @layer renderer-shell @kind types */
import type { DeviceEntry } from '../../../device.type';
import type { ShownDeviceCardAction } from '../../device-card-action.type';

interface DeviceActionsProps {
  entry: DeviceEntry;
  actions: readonly ShownDeviceCardAction[];
}

export type { DeviceActionsProps };
