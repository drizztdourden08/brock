/* @layer renderer-shell @kind logic */
import { buildDeviceProfileFromResolved } from '../../../../../device-profile';
import type { DeviceProfile } from '../../../../../device-profile';
import type { ResolvedDevice } from '../../../../../family';
import type { DeviceFamily } from '../../../../../sdl/device-family.type';
import { toHex4 } from './to-hex4';

const buildProfileFromResolved = (resolved: ResolvedDevice, vendorId: number, productId: number): DeviceProfile =>
  buildDeviceProfileFromResolved(
    {
      id: resolved.sdlType,
      name: resolved.name,
      family: (resolved.brandLogoKey || 'generic') as DeviceFamily,
      inputApi: 'hid',
      vendorId: toHex4(vendorId),
      productId: toHex4(productId),
    },
    resolved,
  );

export { buildProfileFromResolved };
