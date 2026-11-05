/* @layer renderer-shell @kind logic */
import type { DeviceEntry } from '../../device.type';
import { POINTING_DEVICE_WORDS } from './detected.constants';
import type { DetectedDevice } from './detected.type';
import { detectFromEntry } from './detect-from-entry';
import { detectKeyboard } from './detect-keyboard';

const isPointingDevice = (entry: DeviceEntry): boolean => {
  const name = (entry.product || '').toLowerCase();
  return POINTING_DEVICE_WORDS.some((word) => name.includes(word));
};

const detectAllDevices = (entries?: readonly DeviceEntry[]): DetectedDevice[] => {
  const devices: DetectedDevice[] = [detectKeyboard(0)];
  for (const entry of entries ?? []) {
    if (!isPointingDevice(entry)) devices.push(detectFromEntry(entry));
  }
  return devices;
};

export { detectAllDevices };
