/* @layer core @kind constants */
import type { ControllerGamepadType } from '../device.type';
import type { ControllerSlotId, PadFamily } from './controller-slot.type';
import type { SdlButtonName } from './sdl-button-name.type';

const CONTROLLER_SLOT_IDS: readonly ControllerSlotId[] = [
  'face.south', 'face.east', 'face.west', 'face.north',
  'dpad.up', 'dpad.down', 'dpad.left', 'dpad.right',
  'shoulder.left', 'shoulder.right',
  'trigger.left', 'trigger.right',
  'stick.left', 'stick.right', 'stick.left.click', 'stick.right.click',
  'meta.view', 'meta.menu', 'meta.guide', 'meta.capture',
  'extra.misc2', 'extra.misc3', 'extra.misc4', 'extra.misc5', 'extra.misc6',
  'extra.paddle.right1', 'extra.paddle.left1', 'extra.paddle.right2', 'extra.paddle.left2', 'extra.touchpad',
];

const BUTTON_SLOTS: ReadonlyArray<readonly [ControllerSlotId, SdlButtonName]> = [
  ['face.south', 'SOUTH'], ['face.east', 'EAST'], ['face.west', 'WEST'], ['face.north', 'NORTH'],
  ['dpad.up', 'DPAD_UP'], ['dpad.down', 'DPAD_DOWN'], ['dpad.left', 'DPAD_LEFT'], ['dpad.right', 'DPAD_RIGHT'],
  ['shoulder.left', 'LEFT_SHOULDER'], ['shoulder.right', 'RIGHT_SHOULDER'],
  ['stick.left.click', 'LEFT_STICK'], ['stick.right.click', 'RIGHT_STICK'],
  ['meta.view', 'BACK'], ['meta.menu', 'START'], ['meta.guide', 'GUIDE'], ['meta.capture', 'MISC1'],
  ['extra.misc2', 'MISC2'], ['extra.misc3', 'MISC3'], ['extra.misc4', 'MISC4'], ['extra.misc5', 'MISC5'], ['extra.misc6', 'MISC6'],
  ['extra.paddle.right1', 'RIGHT_PADDLE1'], ['extra.paddle.left1', 'LEFT_PADDLE1'],
  ['extra.paddle.right2', 'RIGHT_PADDLE2'], ['extra.paddle.left2', 'LEFT_PADDLE2'],
  ['extra.touchpad', 'TOUCHPAD'],
];

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

export { CONTROLLER_SLOT_IDS, BUTTON_SLOTS, FAMILY_OF_TYPE };
