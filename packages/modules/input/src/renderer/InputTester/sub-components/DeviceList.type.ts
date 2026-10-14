/* @layer renderer-shell @kind types */
import type { DeviceEntry } from '../../../device.type';
import type { DeviceCardAction } from '../../device-card-action.type';

interface DeviceListProps {
  entries: readonly DeviceEntry[];
  available: boolean;
  loaded: boolean;
  deviceActions?: readonly DeviceCardAction[];
}

export type { DeviceListProps };
