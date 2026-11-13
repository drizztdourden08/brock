/* @layer renderer-components @kind types */
import type { DetectedDevice } from '../../../bindings';
import type { ControllerDeviceGroup } from '../../../renderer';
import type { ControlsLabels, PresetDevice } from '../ControlsSettings.type';

interface ControlsDevicesProps {
  devices: readonly DetectedDevice[];
  extraDevices?: readonly DetectedDevice[];
  controllerGroups: readonly ControllerDeviceGroup[];
  labels: ControlsLabels;
  narrow: boolean;
  isRescanPending: boolean;
  onRescan: () => void;
  onPreset: (device: PresetDevice) => void;
  onAddMapping: (mapping: string) => Promise<boolean>;
}

export type { ControlsDevicesProps };
