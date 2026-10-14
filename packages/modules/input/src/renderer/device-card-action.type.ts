/* @layer renderer-shell @kind types */
import type { ButtonVariant, IconName } from '@drizztdourden08/tessera/primitives';
import type { DeviceEntry } from '../device.type';

interface DeviceCardAction {
  id: string;
  label: string;
  icon?: IconName;
  variant?: ButtonVariant;
  disabled?: boolean | ((entry: DeviceEntry) => boolean);
  visible?: (entry: DeviceEntry) => boolean;
  onSelect: (entry: DeviceEntry) => void | Promise<void>;
}

interface ShownDeviceCardAction {
  action: DeviceCardAction;
  disabled: boolean;
}

interface DeviceCardActionState {
  groups: readonly (readonly DeviceCardAction[])[];
  add: (actions: readonly DeviceCardAction[]) => () => void;
}

export type { DeviceCardAction, DeviceCardActionState, ShownDeviceCardAction };
