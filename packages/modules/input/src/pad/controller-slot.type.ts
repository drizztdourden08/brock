/* @layer core @kind types */
type ControllerSlotId =
  | 'face.south' | 'face.east' | 'face.west' | 'face.north'
  | 'dpad.up' | 'dpad.down' | 'dpad.left' | 'dpad.right'
  | 'shoulder.left' | 'shoulder.right'
  | 'trigger.left' | 'trigger.right'
  | 'stick.left' | 'stick.right' | 'stick.left.click' | 'stick.right.click'
  | 'meta.view' | 'meta.menu' | 'meta.guide' | 'meta.capture'
  | 'extra.misc2' | 'extra.misc3' | 'extra.misc4' | 'extra.misc5' | 'extra.misc6'
  | 'extra.paddle.right1' | 'extra.paddle.left1' | 'extra.paddle.right2' | 'extra.paddle.left2' | 'extra.touchpad';

interface ControllerSlotState {
  pressed?: boolean;
  value?: number;
  x?: number;
  y?: number;
}

type PadState = Partial<Record<ControllerSlotId, ControllerSlotState>>;

type PadFamily = 'xbox' | 'playstation' | 'nintendo' | 'generic';

type PadStateListener = (deviceKey: string, state: PadState) => void;

export type { ControllerSlotId, ControllerSlotState, PadState, PadFamily, PadStateListener };
