/* @layer core @kind logic */
import { buildDisplayContext } from '../../family/resolve-display/build-display-context';
import { resolveBrandLogoKey } from '../../family/resolve-display/resolve-brand-logo-key';
import type { DeviceFamily } from '../../sdl/device-family.type';
import type { SdlGamepadType } from '../../sdl/sdl-buttons.type';

const presetDeviceFamily = (sdlType: string): DeviceFamily => {
  if (sdlType === 'keyboard') return 'keyboard';
  const ctx = buildDisplayContext({ sdlType: sdlType as SdlGamepadType });
  return (resolveBrandLogoKey(ctx) || 'generic') as DeviceFamily;
};

export { presetDeviceFamily };
