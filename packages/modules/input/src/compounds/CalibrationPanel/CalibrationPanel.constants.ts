/* @layer renderer-shell @kind constants */
import type { InputIconFamily } from '@drizztdourden08/tessera/primitives';

const CALIBRATION_PANEL_TEXT = {
  cancel: 'Cancel',
  buttons: 'Buttons held',
} as const;

const READING_ICON_SIZE = 24;

const DEFAULT_INPUT_FAMILY: InputIconFamily = 'generic';

const VENDOR_FAMILIES: Readonly<Record<number, InputIconFamily>> = {
  0x045e: 'xbox',
  0x054c: 'playstation',
  0x057e: 'switch',
};

const SDL_CONTROL_IDS: Readonly<Record<string, string>> = {
  SOUTH: 'a', EAST: 'b', WEST: 'x', NORTH: 'y', BACK: 'back', GUIDE: 'guide', START: 'start',
  LEFT_STICK: 'leftstick', RIGHT_STICK: 'rightstick', LEFT_SHOULDER: 'leftshoulder', RIGHT_SHOULDER: 'rightshoulder',
  DPAD_UP: 'dpup', DPAD_DOWN: 'dpdown', DPAD_LEFT: 'dpleft', DPAD_RIGHT: 'dpright',
  MISC1: 'misc1', MISC2: 'misc2', RIGHT_PADDLE1: 'paddle1', LEFT_PADDLE1: 'paddle2', RIGHT_PADDLE2: 'paddle3', LEFT_PADDLE2: 'paddle4',
  TOUCHPAD: 'touchpad', LEFT_TRIGGER: 'lefttrigger', RIGHT_TRIGGER: 'righttrigger',
};

const STICK_ICON_NAMES: Readonly<Record<string, readonly string[]>> = {
  LEFT_STICK: ['stick-l', 'stick'],
  RIGHT_STICK: ['stick-r', 'stick'],
};

export { CALIBRATION_PANEL_TEXT, DEFAULT_INPUT_FAMILY, READING_ICON_SIZE, SDL_CONTROL_IDS, STICK_ICON_NAMES, VENDOR_FAMILIES };
