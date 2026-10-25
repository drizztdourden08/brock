/* @layer renderer-shell @kind types */
import type { DeviceFamily } from '../sdl/device-family.type';

interface ControllerCardInfo {
  vendorId: string;
  productId: string;
  deviceFamily: DeviceFamily;
  displayName: string;
  sdlType: string | null;
}

export type { ControllerCardInfo };
