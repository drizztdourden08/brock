/* @layer core @kind constants */
import type { ControllerGamepadType } from '../device.type';
import type { ControllerSlotId, PadFamily } from './controller-slot.type';
import type { SdlButtonName } from './sdl-button-name.type';

const BUTTON_SLOTS: ReadonlyArray<readonly [ControllerSlotId, SdlButtonName]> = [
  ['face.south', 'SOUTH'], ['face.east', 'EAST'], ['face.west', 'WEST'], ['face.north', 'NORTH'],
  ['dpad.up', 'DPAD_UP'], ['dpad.down', 'DPAD_DOWN'], ['dpad.left', 'DPAD_LEFT'], ['dpad.right', 'DPAD_RIGHT'],
  ['shoulder.left', 'LEFT_SHOULDER'], ['shoulder.right', 'RIGHT_SHOULDER'],
  ['stick.left.click', 'LEFT_STICK'], ['stick.right.click', 'RIGHT_STICK'],
  ['meta.view', 'BACK'], ['meta.menu', 'START'], ['meta.guide', 'GUIDE'], ['meta.capture', 'MISC1'],
];

const EXTRA_BUTTONS: ReadonlyArray<readonly [string, string, SdlButtonName]> = [
  ['extra.misc2', 'Misc 2', 'MISC2'], ['extra.misc3', 'Misc 3', 'MISC3'], ['extra.misc4', 'Misc 4', 'MISC4'],
  ['extra.misc5', 'Misc 5', 'MISC5'], ['extra.misc6', 'Misc 6', 'MISC6'],
  ['extra.paddle.right1', 'Paddle R1', 'RIGHT_PADDLE1'], ['extra.paddle.left1', 'Paddle L1', 'LEFT_PADDLE1'],
  ['extra.paddle.right2', 'Paddle R2', 'RIGHT_PADDLE2'], ['extra.paddle.left2', 'Paddle L2', 'LEFT_PADDLE2'],
  ['extra.touchpad', 'Touchpad', 'TOUCHPAD'],
];

const EXTRA_FAMILY_LABELS: Partial<Record<PadFamily, Readonly<Record<string, string>>>> = {
  xbox: {
    'extra.paddle.right1': 'P1', 'extra.paddle.right2': 'P2', 'extra.paddle.left1': 'P3', 'extra.paddle.left2': 'P4',
  },
  playstation: {
    'extra.paddle.right1': 'RB', 'extra.paddle.left1': 'LB', 'extra.paddle.right2': 'Right Fn', 'extra.paddle.left2': 'Left Fn',
  },
  nintendo: { 'extra.paddle.right1': 'GR', 'extra.paddle.left1': 'GL' },
};

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

export { BUTTON_SLOTS, EXTRA_BUTTONS, EXTRA_FAMILY_LABELS, FAMILY_OF_TYPE };
