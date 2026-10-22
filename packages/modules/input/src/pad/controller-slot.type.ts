/* @layer core @kind types */
// These types mirror Tessera's ControllerSlotId and ControllerSlotState. Switch to a type import once Tessera ships them.

type ControllerSlotId =
  | 'face.south' | 'face.east' | 'face.west' | 'face.north'
  | 'dpad.up' | 'dpad.down' | 'dpad.left' | 'dpad.right'
  | 'shoulder.left' | 'shoulder.right'
  | 'trigger.left' | 'trigger.right'
  | 'stick.left' | 'stick.right' | 'stick.left.click' | 'stick.right.click'
  | 'meta.view' | 'meta.menu' | 'meta.guide' | 'meta.capture'
  | 'extra.misc' | 'extra.paddle1' | 'extra.paddle2' | 'extra.paddle3' | 'extra.paddle4' | 'extra.touchpad';

// Plain data only. Buttons set `pressed`, triggers set `value` (0..1), sticks set `x` and `y` (-1..1, up is positive).
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
