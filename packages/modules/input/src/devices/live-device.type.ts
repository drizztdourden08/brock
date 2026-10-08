/* @layer core @kind types */
import type { ControllerConnectionState, ControllerGamepadType } from '../device.type';

interface LiveDevice {
  deviceKey: string;
  name: string;
  sdlId: number;
  vendorId: number;
  productId: number;
  guid: string;
  mapping: string | null;
  hasRumble: boolean;
  hasGyro: boolean;
  connectionState: ControllerConnectionState;
  sdlType: ControllerGamepadType;
  hasButton: boolean[];
  hasAxis: boolean[];
  buttonLabels: string[];
}

export type { LiveDevice };
