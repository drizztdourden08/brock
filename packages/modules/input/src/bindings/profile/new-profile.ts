/* @layer core @kind logic */
import type { ActionBinding } from '../bindings.type';
import type { InputProfile } from '../input-profile.type';

const newProfile = (existingCount: number, keyboardDefaults: readonly ActionBinding[]): InputProfile => {
  const now = Date.now();
  return {
    id: `custom-${now}`,
    name: `Custom Profile ${existingCount + 1}`,
    deviceType: 'keyboard',
    deviceFamily: 'keyboard',
    mappings: [...keyboardDefaults],
    isDefault: false,
    assignedDevice: null,
    createdAt: now,
    modifiedAt: now,
  };
};

export { newProfile };
