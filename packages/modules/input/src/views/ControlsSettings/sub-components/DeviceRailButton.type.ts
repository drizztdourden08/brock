/* @layer renderer-components @kind types */
import type { DeviceAssignInfo, DeviceListEntry } from './DeviceRow.type';

interface DeviceRailButtonProps {
  entry: DeviceListEntry;
  onAssign: (device: DeviceAssignInfo) => void;
}

export type { DeviceRailButtonProps };
