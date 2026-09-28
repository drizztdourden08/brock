/* @layer renderer-shell @kind types */
import type { DeviceEntry } from '../../../device.type';

interface DeviceListProps {
  entries: readonly DeviceEntry[];
  available: boolean;
  loaded: boolean;
}

export type { DeviceListProps };
