/* @layer electron-main @kind logic */
import type { DeviceEntry, HidListedDevice } from '../device.type';
import type { ControllerRegistry } from './controller-registry.type';
import type { LiveDevice } from '../devices/live-device.type';
import type { Sdl3AddedEvent, Sdl3Input } from './sdl3.type';
import { buildDeviceSnapshot } from '../devices/build-device-snapshot';
import { createDeviceKeys } from '../devices/device-keys';
import { listHidDevices } from './list-hid-devices';

const createControllerRegistry = (addon: Sdl3Input): ControllerRegistry => {
  const keys = createDeviceKeys();
  const live = new Map<string, LiveDevice>();
  let listed: HidListedDevice[] = [];

  const refreshListed = (): void => {
    listed = listHidDevices(addon);
  };

  const add = (event: Sdl3AddedEvent): LiveDevice => {
    const { type: _type, id, ...info } = event;
    const deviceKey = keys.assign(id, event.vendorId, event.productId);
    refreshListed();
    const device: LiveDevice = { ...info, deviceKey, sdlId: id, mapping: addon.mappingForGuid(event.guid) };
    live.set(deviceKey, device);
    return device;
  };

  const remove = (sdlId: number): string | undefined => {
    const deviceKey = keys.release(sdlId);
    if (!deviceKey) return undefined;
    live.delete(deviceKey);
    refreshListed();
    return deviceKey;
  };

  const busTypeOf = (device: LiveDevice): HidListedDevice['busType'] =>
    listed.find((entry) => entry.vendorId === device.vendorId && entry.productId === device.productId)?.busType ?? 'unknown';

  const snapshot = (): DeviceEntry[] => buildDeviceSnapshot(live, listed);

  return {
    add,
    remove,
    keyFor: keys.keyFor,
    device: (deviceKey) => live.get(deviceKey),
    busTypeOf,
    refreshListed,
    listed: () => listed,
    snapshot,
    clear: () => live.clear(),
  };
};

export { createControllerRegistry };
