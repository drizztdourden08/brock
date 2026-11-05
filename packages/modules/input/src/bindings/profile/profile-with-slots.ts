/* @layer core @kind logic */
import type { BindingSlot } from '../bindings.type';
import type { InputProfile } from '../input-profile.type';

const profileWithSlots = (profile: InputProfile, slots: BindingSlot[]): InputProfile => ({
  ...profile,
  slots,
  modifiedAt: Date.now(),
});

export { profileWithSlots };
