/* @layer core @kind logic */
import type { DeviceEntry, HidListedDevice } from '../device.type';
import type { LiveDevice } from './live-device.type';
import { padFamilyOf } from '../pad/pad-family-of';
import { servedByXInput } from './served-by-xinput';
import { toVidPid } from './vid-pid';

const findListed = (listed: readonly HidListedDevice[], vendorId: number, productId: number): HidListedDevice | undefined =>
  listed.find((device) => device.vendorId === vendorId && device.productId === productId);

const readyEntry = (device: LiveDevice, listed: readonly HidListedDevice[]): DeviceEntry => {
  const { mapping, ...rest } = device;
  const match = findListed(listed, device.vendorId, device.productId);
  return {
    ...rest,
    ...(mapping === null ? {} : { mapping }),
    family: padFamilyOf(device.sdlType),
    product: match?.product ?? '',
    busType: match?.busType ?? 'unknown',
    status: 'ready',
  };
};

const unavailableEntry = ({ xinput: _xinput, ...device }: HidListedDevice): DeviceEntry => ({
  ...device,
  deviceKey: toVidPid(device.vendorId, device.productId),
  status: 'unavailable',
});

const unclaimedListings = (devices: readonly LiveDevice[], listed: readonly HidListedDevice[]): HidListedDevice[] => {
  const claimed = new Set(devices.map((device) => toVidPid(device.vendorId, device.productId)));
  let freeXInputPads = devices
    .filter((device) => servedByXInput(device.guid) && !findListed(listed, device.vendorId, device.productId))
    .length;
  const unclaimed: HidListedDevice[] = [];
  for (const device of listed) {
    if (claimed.has(toVidPid(device.vendorId, device.productId))) continue;
    if (device.xinput === true && freeXInputPads > 0) {
      freeXInputPads -= 1;
      continue;
    }
    unclaimed.push(device);
  }
  return unclaimed;
};

const buildDeviceSnapshot = (live: ReadonlyMap<string, LiveDevice>, listed: readonly HidListedDevice[]): DeviceEntry[] => {
  const devices = [...live.values()];
  const unclaimed = unclaimedListings(devices, listed);
  return [...devices.map((device) => readyEntry(device, listed)), ...unclaimed.map(unavailableEntry)];
};

export { buildDeviceSnapshot };
