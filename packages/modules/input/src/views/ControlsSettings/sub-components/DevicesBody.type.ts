/* @layer renderer-components @kind types */
import type { ControlsLabels } from '../ControlsSettings.type';
import type { DeviceAssignInfo, DeviceListEntry } from './DeviceRow.type';

interface DevicesBodyProps {
  entries: readonly DeviceListEntry[];
  labels: ControlsLabels;
  onAssign: (device: DeviceAssignInfo) => void;
  onAddMapping: (mapping: string) => Promise<boolean>;
}

export type { DevicesBodyProps };
