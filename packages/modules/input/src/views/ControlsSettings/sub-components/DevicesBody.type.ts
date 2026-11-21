/* @layer renderer-components @kind types */
import type { ResolvedControlsLabels } from '../ControlsSettings.type';
import type { DeviceAssignInfo, DeviceListEntry } from './DeviceRow.type';

interface DevicesBodyProps {
  entries: readonly DeviceListEntry[];
  labels: ResolvedControlsLabels;
  onAssign: (device: DeviceAssignInfo) => void;
  onAddMapping: (mapping: string) => Promise<boolean>;
}

export type { DevicesBodyProps };
