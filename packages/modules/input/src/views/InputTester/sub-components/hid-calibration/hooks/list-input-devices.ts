/* @layer renderer-shell @kind logic */
import { inputApi } from '../../../../../renderer/input-api';
import type { DeviceEntry } from '../../../../../device.type';

const listInputDevices = (): Promise<DeviceEntry[]> => inputApi().list();

export { listInputDevices };
