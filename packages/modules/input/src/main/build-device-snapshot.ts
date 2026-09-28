/* @layer electron-main @kind logic */
import type { DeviceEntry, HidListedDevice } from '../device.type';
import type { LiveDevice } from './live-device.type';
import { toVidPid } from './vid-pid';

const findListed = (listed: readonly HidListedDevice[], vendorId: number, productId: number): HidListedDevice | undefined =>
  listed.find((device) => device.vendorId === vendorId && device.productId === productId);

const readyEntry = (device: LiveDevice, listed: readonly HidListedDevice[]): DeviceEntry => {
  const { mapping, ...rest } = device;
  const match = findListed(listed, device.vendorId, device.productId);
  return {
    ...rest,
    ...(mapping === null ? {} : { mapping }),
    product: match?.product ?? '',
    busType: match?.busType ?? 'unknown',
    status: 'ready',
  };
};

const unavailableEntry = (device: HidListedDevice): DeviceEntry => ({
  ...device,
  deviceKey: toVidPid(device.vendorId, device.productId),
  status: 'unavailable',
});

const buildDeviceSnapshot = (live: ReadonlyMap<string, LiveDevice>, listed: readonly HidListedDevice[]): DeviceEntry[] => {
  const devices = [...live.values()];
  const claimed = new Set(devices.map((device) => toVidPid(device.vendorId, device.productId)));
  const unclaimed = listed.filter((device) => !claimed.has(toVidPid(device.vendorId, device.productId)));
  return [...devices.map((device) => readyEntry(device, listed)), ...unclaimed.map(unavailableEntry)];
};

export { buildDeviceSnapshot };
