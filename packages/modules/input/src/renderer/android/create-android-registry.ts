/* @layer renderer-shell @kind logic */
import type { HidListedDevice } from '../../device.type';
import { buildDeviceSnapshot } from '../../devices/build-device-snapshot';
import { createDeviceKeys } from '../../devices/device-keys';
import type { LiveDevice } from '../../devices/live-device.type';
import type { AndroidRegistry } from './android-input.type';
import { busOfConnection } from './bus-of-connection';

const listedOf = (device: LiveDevice): HidListedDevice => ({
  vendorId: device.vendorId,
  productId: device.productId,
  product: device.name,
  busType: busOfConnection(device.connectionState),
});

const createAndroidRegistry = (): AndroidRegistry => {
  const keys = createDeviceKeys();
  const live = new Map<string, LiveDevice>();

  return {
    add: (event) => {
      const { type: _type, id, mapping, ...info } = event;
      const deviceKey = keys.assign(id, event.vendorId, event.productId);
      const device: LiveDevice = { ...info, deviceKey, sdlId: id, mapping: mapping ?? null };
      live.set(deviceKey, device);
      return device;
    },
    remove: (sdlId) => {
      const deviceKey = keys.release(sdlId);
      if (deviceKey) live.delete(deviceKey);
      return deviceKey;
    },
    keyFor: keys.keyFor,
    device: (deviceKey) => live.get(deviceKey),
    snapshot: () => buildDeviceSnapshot(live, [...live.values()].map(listedOf)),
  };
};

export { createAndroidRegistry };
