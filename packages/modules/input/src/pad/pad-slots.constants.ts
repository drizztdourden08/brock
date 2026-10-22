/* @layer core @kind constants */
import type { ControllerGamepadType } from '../device.type';
import type { SDL_BUTTON_NAMES } from '../input.constants';
import type { ControllerSlotId, PadFamily } from './controller-slot.type';

type SdlButtonName = (typeof SDL_BUTTON_NAMES)[number];

const CONTROLLER_SLOT_IDS: readonly ControllerSlotId[] = [
  'face.south', 'face.east', 'face.west', 'face.north',
  'dpad.up', 'dpad.down', 'dpad.left', 'dpad.right',
  'shoulder.left', 'shoulder.right',
  'trigger.left', 'trigger.right',
  'stick.left', 'stick.right', 'stick.left.click', 'stick.right.click',
  'meta.view', 'meta.menu', 'meta.guide', 'meta.capture',
  'extra.misc', 'extra.paddle1', 'extra.paddle2', 'extra.paddle3', 'extra.paddle4', 'extra.touchpad',
];

// One SDL button per slot. SDL's MISC1 is the share, capture or microphone button.
// Paddles follow SDL's order: right 1, left 1, right 2, left 2.
const BUTTON_SLOTS: ReadonlyArray<readonly [ControllerSlotId, SdlButtonName]> = [
  ['face.south', 'SOUTH'], ['face.east', 'EAST'], ['face.west', 'WEST'], ['face.north', 'NORTH'],
  ['dpad.up', 'DPAD_UP'], ['dpad.down', 'DPAD_DOWN'], ['dpad.left', 'DPAD_LEFT'], ['dpad.right', 'DPAD_RIGHT'],
  ['shoulder.left', 'LEFT_SHOULDER'], ['shoulder.right', 'RIGHT_SHOULDER'],
  ['stick.left.click', 'LEFT_STICK'], ['stick.right.click', 'RIGHT_STICK'],
  ['meta.view', 'BACK'], ['meta.menu', 'START'], ['meta.guide', 'GUIDE'], ['meta.capture', 'MISC1'],
  ['extra.paddle1', 'RIGHT_PADDLE1'], ['extra.paddle2', 'LEFT_PADDLE1'],
  ['extra.paddle3', 'RIGHT_PADDLE2'], ['extra.paddle4', 'LEFT_PADDLE2'],
  ['extra.touchpad', 'TOUCHPAD'],
];

// SDL's spare buttons, any of which lights extra.misc.
const MISC_BUTTONS: readonly SdlButtonName[] = ['MISC2', 'MISC3', 'MISC4', 'MISC5', 'MISC6'];

const FAMILY_OF_TYPE: Record<ControllerGamepadType, PadFamily> = {
  unknown: 'generic',
  standard: 'generic',
  xbox360: 'xbox',
  xboxone: 'xbox',
  ps3: 'playstation',
  ps4: 'playstation',
  ps5: 'playstation',
  'switch-pro': 'nintendo',
  'joycon-left': 'nintendo',
  'joycon-right': 'nintendo',
  'joycon-pair': 'nintendo',
  gamecube: 'nintendo',
};

export { CONTROLLER_SLOT_IDS, BUTTON_SLOTS, MISC_BUTTONS, FAMILY_OF_TYPE };
