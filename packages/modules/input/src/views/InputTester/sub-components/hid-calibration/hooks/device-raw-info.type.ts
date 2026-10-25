/* @layer renderer-shell @kind types */
import type { ControllerBusType } from '../../../../../device.type';

interface RawHidInfo {
  path: string | null;
  manufacturer: string | null;
  product: string | null;
  serialNumber: string | null;
  busType: ControllerBusType | null;
}

export type { RawHidInfo };
