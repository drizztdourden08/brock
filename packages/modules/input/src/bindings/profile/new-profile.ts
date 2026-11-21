/* @layer core @kind logic */
import { msg } from '@drizztdourden08/brock-core/i18n';
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { ActionBinding } from '../bindings.type';
import type { InputProfile } from '../input-profile.type';

const newProfile = (
  existingCount: number,
  keyboardDefaults: readonly ActionBinding[],
  text: (value: Text) => string,
): InputProfile => {
  const now = Date.now();
  return {
    id: `custom-${now}`,
    name: text(msg('input:profile.custom', { n: existingCount + 1 })),
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
