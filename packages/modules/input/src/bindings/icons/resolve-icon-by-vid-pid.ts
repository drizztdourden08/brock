/* @layer renderer-shell @kind logic */
import { buildDeviceProfileFromSdlType } from '../../device-profile/build-device-profile-from-sdl-type';
import { recallControllerSdlType } from '../../runtime/controller-family-cache/recall-controller-sdl-type';
import type { SdlGamepadType } from '../../sdl/sdl-buttons.type';
import type { ButtonIcon, InputBinding } from '../bindings.type';
import { axisIcon } from './axis-icon';

const resolveIconByVidPid = (
  vid: string,
  pid: string,
  binding: InputBinding,
  liveSdlType?: string | null,
): ButtonIcon | null => {
  const sdlType = recallControllerSdlType(parseInt(vid, 16), parseInt(pid, 16)) ?? liveSdlType ?? null;
  if (!sdlType) return null;
  const profile = buildDeviceProfileFromSdlType(
    { id: sdlType, name: sdlType, family: 'generic', inputApi: 'hid', vendorId: vid, productId: pid },
    sdlType as SdlGamepadType,
  );
  if (binding.type === 'gamepad-button') {
    const button = profile.buttonsByIndex[binding.index];
    return button ? { key: button.icon, label: button.label, path: null } : null;
  }
  if (binding.type === 'gamepad-axis') {
    const axis = profile.axes[binding.axisIndex];
    return axis ? axisIcon(axis, binding) : null;
  }
  return null;
};

export { resolveIconByVidPid };
