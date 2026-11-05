/* @layer core @kind types */
import type { DeviceFamily } from '../sdl/device-family.type';
import type { ActionBinding, BindingSlot, VerbBindings } from './bindings.type';

interface AssignedDevice {
  vendorId: string;
  productId: string;
  displayName: string;
  deviceFamily: DeviceFamily;
}

type InputProfileExtension = Readonly<Record<string, unknown>>;

interface InputProfile {
  id: string;
  name: string;
  deviceType: 'gamepad' | 'keyboard';
  deviceFamily: DeviceFamily;
  mappings: ActionBinding[];
  isDefault: boolean;
  assignedDevice: AssignedDevice | null;
  createdAt: number;
  modifiedAt: number;
  verbs?: VerbBindings;
  slots?: BindingSlot[];
  extension?: InputProfileExtension;
}

export type { AssignedDevice, InputProfile, InputProfileExtension };
