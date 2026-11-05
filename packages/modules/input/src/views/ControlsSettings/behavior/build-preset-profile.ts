/* @layer renderer-components @kind logic */
import { controlsForDevice } from '../../../bindings/detected/controls-for-device';
import { presetDeviceFamily } from '../../../bindings/detected/preset-device-family';
import { padHexOrNull } from '../../../bindings/device-keys/pad-hex-or-null';
import type { InputProfile } from '../../../bindings/input-profile.type';
import type { BuildPresetProfileParams } from './controls-behavior.type';

const buildPresetProfile = ({ preset, profile, game, entries }: BuildPresetProfileParams): InputProfile => {
  const vid = padHexOrNull(preset.vid) ?? '';
  const pid = padHexOrNull(preset.pid) ?? '';
  const device = { ...preset, vid, pid };
  const isKeyboard = preset.sdlType === 'keyboard';
  const deviceFamily = presetDeviceFamily(preset.sdlType);

  const built: InputProfile = {
    ...profile,
    name: preset.deviceName,
    deviceType: isKeyboard ? 'keyboard' : 'gamepad',
    deviceFamily,
    mappings: game.defaultBindings(device),
    assignedDevice: isKeyboard ? null : { vendorId: vid, productId: pid, displayName: preset.deviceName, deviceFamily },
    verbs: undefined,
    slots: undefined,
    modifiedAt: Date.now(),
  };
  if (!game.decoratePreset) return built;
  const controls = isKeyboard ? [] : controlsForDevice({ vid, pid, sdlType: preset.sdlType }, entries);
  return game.decoratePreset(built, { device, controls });
};

export { buildPresetProfile };
