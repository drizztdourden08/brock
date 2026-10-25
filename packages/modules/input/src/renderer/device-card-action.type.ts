/* @layer renderer-shell @kind types */
import type { ButtonVariant, IconName } from '@drizztdourden08/tessera/primitives';
import type { DeviceEntry } from '../device.type';
import type { DiagnosticsRunResult } from './diagnostics-run-result.type';

interface DeviceCardAction {
  id: string;
  label: string;
  icon?: IconName;
  variant?: ButtonVariant;
  disabled?: boolean | ((entry: DeviceEntry) => boolean);
  visible?: (entry: DeviceEntry) => boolean;
  onSelect: (entry: DeviceEntry, result?: DiagnosticsRunResult) => void | Promise<void>;
}

interface ShownDeviceCardAction {
  action: DeviceCardAction;
  disabled: boolean;
}

export type { DeviceCardAction, ShownDeviceCardAction };
