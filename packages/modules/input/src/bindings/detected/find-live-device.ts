/* @layer core @kind logic */
import { padHex } from '../device-keys/pad-hex';
import type { DetectedDevice } from './detected.type';

const findLiveDevice = (vid: string, pid: string, devices: readonly DetectedDevice[]): DetectedDevice | undefined =>
  devices.find((device) =>
    device.type === 'gamepad' && device.connected &&
    device.vendorId && device.productId &&
    padHex(device.vendorId) === vid && padHex(device.productId) === pid);

export { findLiveDevice };
