/* @layer renderer-components @kind constants */
import { msg } from '@drizztdourden08/brock-core/i18n';
import type { ControllerBusType } from '../../device.type';
import type { DetectedDevice } from '../../bindings/detected/detected.type';
import type { ControlsLabels, NarrowTabId } from './ControlsSettings.type';

const NO_EXTRA_DEVICES: readonly DetectedDevice[] = [];
const FOLD_KEY_PREFIX = 'brock-input:controls.';
const PROFILES_FOLD_KEY = `${FOLD_KEY_PREFIX}profiles.collapsed`;
const DEVICES_FOLD_KEY = `${FOLD_KEY_PREFIX}devices.collapsed`;
const PROFILES_WIDTH_KEY = `${FOLD_KEY_PREFIX}profiles.width`;
const DEVICES_WIDTH_KEY = `${FOLD_KEY_PREFIX}devices.width`;

const MIN_PROFILE_BINDING_COLUMNS = 2;
const MAX_BINDING_COLUMNS = 4;
const DEFAULT_PROFILE_ID = 'default-keyboard';
const FOCUS_DEADLINE_MS = 3000;
const FOCUS_MAX_ATTEMPTS = 180;

const MODIFIER_CODES = new Set([
  'ShiftLeft', 'ShiftRight', 'ControlLeft', 'ControlRight',
  'AltLeft', 'AltRight', 'MetaLeft', 'MetaRight',
]);

const CANCEL_ARM_DELAY_MS = 150;
const LISTEN_ARM_DELAY_MS = 200;

const SIDE_PANEL_SIZE = { width: 192, minWidth: 160, maxWidth: 360 };

const NARROW_WIDTH_PX = 640;
const NARROW_TAB_DEFAULT: NarrowTabId = 'bindings';
const CONTROLS_ROOT_SELECTOR = '.controls-settings';

const KEYBOARD_ICON_FAMILY = 'keyboard';
const GENERIC_ICON_FAMILY = 'generic';

const DRAG_SDL_TYPE = 'application/x-sdl-type';
const DRAG_DEVICE_NAME = 'application/x-device-name';
const DRAG_VID = 'application/x-vid';
const DRAG_PID = 'application/x-pid';

const BUS_NAME: Record<ControllerBusType, string | null> = { usb: 'USB', bluetooth: 'Bluetooth', unknown: null };

const DEFAULT_LABELS: ControlsLabels = {
  profilesTitle: msg('input:controls.profilesTitle'),
  tabBindings: msg('input:controls.tabBindings'),
  profileList: msg('input:controls.profileList'),
  newProfile: msg('input:controls.newProfile'),
  noProfiles: msg('input:controls.noProfiles'),
  profileName: msg('input:controls.profileName'),
  renameProfile: msg('input:controls.renameProfile'),
  deleteProfile: msg('input:controls.deleteProfile'),
  devicesTitle: msg('input:controls.devicesTitle'),
  connectedDevices: msg('input:controls.connectedDevices'),
  noDevices: msg('input:controls.noDevices'),
  keyboard: msg('input:controls.keyboard'),
  controller: msg('input:controls.controller'),
  bindingHeader: msg('input:controls.bindingHeader'),
  actionHeader: msg('input:controls.actionHeader'),
  slotHeader: msg('input:controls.slotHeader'),
  assignmentHeader: msg('input:controls.assignmentHeader'),
  slotsTitle: msg('input:controls.slotsTitle'),
  slotsHint: '',
  verbsHeader: msg('input:controls.verbsHeader'),
  groupHeader: msg('input:controls.groupHeader'),
  noSlots: msg('input:controls.noSlots'),
  addSlot: msg('input:controls.addSlot'),
  emptySlotsHint: msg('input:controls.emptySlotsHint'),
  clearBinding: msg('input:controls.clearBinding'),
  reservedHint: msg('input:controls.reservedHint'),
  rebindHint: (name) => msg('input:controls.rebindHint', { name }),
  removeSlot: (name) => msg('input:controls.removeSlot', { name }),
  listenerPrompt: msg('input:controls.listenerPrompt'),
  listenerHint: msg('input:controls.listenerHint'),
  presetTitle: msg('input:controls.presetTitle'),
  presetMessage: (deviceName) => msg('input:controls.presetMessage', { deviceName }),
  presetConfirm: msg('input:controls.presetConfirm'),
  deleteTitle: msg('input:controls.deleteTitle'),
  deleteMessage: (profileName) => msg('input:controls.deleteMessage', { profileName }),
  deleteConfirm: msg('input:controls.deleteConfirm'),
  cancel: msg('input:controls.cancel'),
  hapticsTitle: msg('input:controls.hapticsTitle'),
  hapticsDescription: msg('input:controls.hapticsDescription'),
  requiredInputsTitle: msg('input:controls.requiredInputsTitle'),
  inputConnected: (name) => msg('input:controls.inputConnected', { name }),
  inputNotConnected: (name) => msg('input:controls.inputNotConnected', { name }),
  statusConnected: msg('input:controls.statusConnected'),
  statusNotConnected: msg('input:controls.statusNotConnected'),
};

export {
  DEFAULT_PROFILE_ID,
  BUS_NAME, CANCEL_ARM_DELAY_MS, CONTROLS_ROOT_SELECTOR, DEFAULT_LABELS, DEVICES_FOLD_KEY,
  DEVICES_WIDTH_KEY, FOCUS_DEADLINE_MS, FOCUS_MAX_ATTEMPTS, PROFILES_WIDTH_KEY,
  DRAG_DEVICE_NAME, DRAG_PID, DRAG_SDL_TYPE, DRAG_VID, GENERIC_ICON_FAMILY, KEYBOARD_ICON_FAMILY,
  LISTEN_ARM_DELAY_MS, MODIFIER_CODES, NARROW_TAB_DEFAULT, NARROW_WIDTH_PX, NO_EXTRA_DEVICES,
  MAX_BINDING_COLUMNS, MIN_PROFILE_BINDING_COLUMNS, PROFILES_FOLD_KEY, SIDE_PANEL_SIZE,
};
