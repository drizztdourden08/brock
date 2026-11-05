/* @layer core @kind types */
import type { DeviceFamily, DeviceInputApi } from '../../sdl/device-family.type';

interface DetectedDevice {
  id: string;
  type: 'gamepad' | 'keyboard';
  rawId: string;
  vendorId: string | null;
  productId: string | null;
  deviceFamily: DeviceFamily;
  displayName: string;
  sdlType: string | null;
  connected: boolean;
  activated: boolean;
  brandLogoKey: string | null;
  inputApi: DeviceInputApi;
  hasRumble: boolean;
  hasGyro: boolean;
}

interface DeviceIdentity {
  vid: string;
  pid: string;
  sdlType?: string | null;
}

export type { DetectedDevice, DeviceIdentity };
