/* @layer core @kind barrel */
export type {
  ActionBinding, BindingSlot, ButtonIcon, GamepadAxisBinding, GamepadButtonBinding, InputBinding, KeyboardBinding,
  NoneBinding, VerbBindings, VerbPosition,
} from './bindings.type';
export type { AssignedDevice, InputProfile, InputProfileExtension } from './input-profile.type';
export { ANY_DEVICE, FIRST_SLOT, UNBOUND } from './bindings.constants';

export { bindingGlyphKeys } from './display/binding-glyph-keys';
export { formatKeyBinding } from './display/format-key-binding';
export { formatKeyCode } from './display/format-key-code';
export { getBindingLabel } from './display/get-binding-label';
export { keyCodeToGlyph } from './display/key-code-to-glyph';

export type { AllowedDevices, DeviceScopedMap } from './device-keys/device-keys.type';
export { allowedDevices } from './device-keys/allowed-devices';
export { deviceKeyFor } from './device-keys/device-key-for';
export { padHex } from './device-keys/pad-hex';
export { padHexOrNull } from './device-keys/pad-hex-or-null';
export { sameGamepadInput } from './device-keys/same-gamepad-input';
export { scopedEntries } from './device-keys/scoped-entries';
export { setScoped } from './device-keys/set-scoped';
export { splitDeviceKey } from './device-keys/split-device-key';

export type {
  BindGlobalActionParams, BindMappingParams, BindProfileActionParams, ClearProfileActionParams,
} from './profile/profile.type';
export { bindGlobalAction } from './profile/bind-global-action';
export { bindMapping } from './profile/bind-mapping';
export { bindProfileAction } from './profile/bind-profile-action';
export { clearProfileAction } from './profile/clear-profile-action';
export { mergeGlobalDefaults } from './profile/merge-global-defaults';
export { newProfile } from './profile/new-profile';
export { profileWithSlots } from './profile/profile-with-slots';
export { profileWithVerbs } from './profile/profile-with-verbs';
