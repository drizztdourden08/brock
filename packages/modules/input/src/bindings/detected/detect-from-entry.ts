/* @layer renderer-shell @kind logic */
import type { DeviceEntry } from '../../device.type';
import { resolveDeviceFromEntry } from '../../runtime/resolve-device';
import type { DeviceFamily } from '../../sdl/device-family.type';
import { padHex } from '../device-keys/pad-hex';
import type { DetectedDevice } from './detected.type';

const detectFromEntry = (entry: DeviceEntry): DetectedDevice => {
  const vendorId = padHex(entry.vendorId.toString(16));
  const productId = padHex(entry.productId.toString(16));
  const resolved = resolveDeviceFromEntry(entry);

  return {
    id: `hid-${vendorId}-${productId}`,
    type: 'gamepad',
    rawId: entry.product,
    vendorId,
    productId,
    deviceFamily: (resolved.brandLogoKey || 'generic') as DeviceFamily,
    displayName: resolved.name,
    sdlType: entry.sdlType ?? 'unknown',
    connected: entry.status === 'ready',
    activated: true,
    brandLogoKey: resolved.brandLogoKey || null,
    inputApi: 'hid',
    hasRumble: entry.hasRumble ?? false,
    hasGyro: entry.hasGyro ?? false,
  };
};

export { detectFromEntry };
