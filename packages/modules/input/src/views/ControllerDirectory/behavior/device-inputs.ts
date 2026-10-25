/* @layer renderer-shell @kind logic */
import type { DeviceEntry } from '../../../device.type';

const deviceInputs = (device: DeviceEntry): number =>
  [...(device.hasButton ?? []), ...(device.hasAxis ?? [])].filter(Boolean).length;

export { deviceInputs };
