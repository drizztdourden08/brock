/* @layer renderer-components @kind constants */
import type { ControllerBusType } from '../../device.type';
import type { DetectedDevice } from '../../bindings/detected/detected.type';
import type { ControlsLabels, NarrowTabId } from './ControlsSettings.type';

const NO_EXTRA_DEVICES: readonly DetectedDevice[] = [];
const FOLD_KEY_PREFIX = 'brock-input:controls.';
const PROFILES_FOLD_KEY = `${FOLD_KEY_PREFIX}profiles.collapsed`;
const DEVICES_FOLD_KEY = `${FOLD_KEY_PREFIX}devices.collapsed`;
const PROFILES_WIDTH_KEY = `${FOLD_KEY_PREFIX}profiles.width`;
const DEVICES_WIDTH_KEY = `${FOLD_KEY_PREFIX}devices.width`;

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
  profilesTitle: 'Profiles',
  tabBindings: 'Bindings',
  profileList: 'Profile list',
  newProfile: 'New profile',
  noProfiles: 'No profiles yet',
  profileName: 'Profile name',
  renameProfile: 'Rename profile',
  deleteProfile: 'Delete profile',
  devicesTitle: 'Devices',
  connectedDevices: 'Connected devices',
  noDevices: 'No devices detected',
  keyboard: 'Keyboard',
  controller: 'Controller',
  bindingHeader: 'Binding',
  actionHeader: 'Action',
  slotHeader: 'Slot',
  assignmentHeader: 'Assignment',
  slotsTitle: 'Slots',
  slotsHint: '',
  verbsHeader: 'Core Verbs',
  groupHeader: 'Group',
  noSlots: 'No slots yet. Add one below.',
  addSlot: 'Add slot',
  emptySlotsHint: 'Assign a controller to this profile to see its slots.',
  clearBinding: 'Clear binding',
  reservedHint: 'Reserved, cannot be rebound',
  rebindHint: (name) => `Click to rebind ${name}`,
  removeSlot: (name) => `Remove ${name}`,
  listenerPrompt: 'Press a key, button, or move a stick for',
  listenerHint: 'Press Escape to cancel. Press Delete to clear.',
  presetTitle: 'Apply Controller Preset',
  presetMessage: (deviceName) =>
    `Assign "${deviceName}" to this profile and apply its default mappings? This will overwrite all current bindings.`,
  presetConfirm: 'Apply',
  deleteTitle: 'Delete Input Profile',
  deleteMessage: (profileName) => `Delete "${profileName}"? This cannot be undone.`,
  deleteConfirm: 'Delete',
  cancel: 'Cancel',
  hapticsTitle: 'Haptics',
  hapticsDescription: 'Every controller assigned to this profile rumbles for game events.',
  requiredInputsTitle: 'Required inputs',
  inputConnected: (name) => `${name} is connected.`,
  inputNotConnected: (name) => `${name} is not connected.`,
  statusConnected: 'Connected',
  statusNotConnected: 'Not connected',
};

export {
  DEFAULT_PROFILE_ID,
  BUS_NAME, CANCEL_ARM_DELAY_MS, CONTROLS_ROOT_SELECTOR, DEFAULT_LABELS, DEVICES_FOLD_KEY,
  DEVICES_WIDTH_KEY, FOCUS_DEADLINE_MS, FOCUS_MAX_ATTEMPTS, PROFILES_WIDTH_KEY,
  DRAG_DEVICE_NAME, DRAG_PID, DRAG_SDL_TYPE, DRAG_VID, GENERIC_ICON_FAMILY, KEYBOARD_ICON_FAMILY,
  LISTEN_ARM_DELAY_MS, MODIFIER_CODES, NARROW_TAB_DEFAULT, NARROW_WIDTH_PX, NO_EXTRA_DEVICES,
  PROFILES_FOLD_KEY, SIDE_PANEL_SIZE,
};
