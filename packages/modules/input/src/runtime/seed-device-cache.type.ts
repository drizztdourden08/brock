/* @layer renderer-shell @kind types */
import type { ControllerGamepadType } from '../device.type';

interface DeviceSnapshotFields {
  deviceKey: string;
  vendorId: number;
  productId: number;
  name?: string;
  sdlType?: ControllerGamepadType;
  hasRumble?: boolean;
}

export type { DeviceSnapshotFields };
