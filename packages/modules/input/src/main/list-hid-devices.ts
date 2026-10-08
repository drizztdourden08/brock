/* @layer electron-main @kind logic */
import type { HidListedDevice } from '../device.type';
import type { Sdl3Input } from './sdl3.type';
import { toVidPid } from '../devices/vid-pid';

const listHidDevices = (addon: Sdl3Input): HidListedDevice[] => {
  const seen = new Map<string, HidListedDevice>();
  for (const device of addon.enumerateHid()) {
    const key = toVidPid(device.vendorId, device.productId);
    if (seen.has(key)) continue;
    seen.set(key, {
      vendorId: device.vendorId,
      productId: device.productId,
      product: device.productString || 'Unknown controller',
      busType: device.busType,
    });
  }
  return [...seen.values()];
};

export { listHidDevices };
