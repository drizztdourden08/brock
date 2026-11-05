/* @layer core @kind logic */
import type { InputProfile } from '../input-profile.type';
import type { AllowedDevices } from './device-keys.type';
import { padHex } from './pad-hex';

const allowedDevices = (profile: InputProfile | null): AllowedDevices => {
  const gamepadKeys = new Set<string>();
  if (!profile) return { keyboard: false, gamepadKeys };

  let keyboard = false;
  for (const mapping of profile.mappings) {
    if (mapping.binding.type === 'keyboard') {
      keyboard = true;
    } else if (mapping.sourceVid && mapping.sourcePid) {
      gamepadKeys.add(`${padHex(mapping.sourceVid)}:${padHex(mapping.sourcePid)}`);
    }
  }

  const assigned = profile.assignedDevice;
  if (assigned?.vendorId && assigned.productId) {
    gamepadKeys.add(`${padHex(assigned.vendorId)}:${padHex(assigned.productId)}`);
  }

  return { keyboard, gamepadKeys };
};

export { allowedDevices };
