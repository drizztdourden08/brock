/* @layer core @kind logic */
import { SDL_AXIS, SDL_BUTTON_NAMES } from '../input.constants';
import type { PadState } from './controller-slot.type';
import { BUTTON_SLOTS, MISC_BUTTONS } from './pad-slots.constants';

const isDown = (buttons: readonly boolean[], name: (typeof SDL_BUTTON_NAMES)[number]): boolean =>
  buttons[SDL_BUTTON_NAMES.indexOf(name)] === true;

// SDL's Y is down-positive. Flip it so up is positive, without producing -0.
const up = (value: number): number => (value === 0 ? 0 : -value);

// Turns the raw state stream (SDL button and axis order) into state keyed by slot. Calibration is not applied.
const padStateOf = (buttons: readonly boolean[], axes: readonly number[]): PadState => {
  const state: PadState = {};
  for (const [slot, name] of BUTTON_SLOTS) state[slot] = { pressed: isDown(buttons, name) };
  state['extra.misc'] = { pressed: MISC_BUTTONS.some((name) => isDown(buttons, name)) };
  state['trigger.left'] = { value: axes[SDL_AXIS.LEFT_TRIGGER] ?? 0 };
  state['trigger.right'] = { value: axes[SDL_AXIS.RIGHT_TRIGGER] ?? 0 };
  state['stick.left'] = { x: axes[SDL_AXIS.LEFTX] ?? 0, y: up(axes[SDL_AXIS.LEFTY] ?? 0) };
  state['stick.right'] = { x: axes[SDL_AXIS.RIGHTX] ?? 0, y: up(axes[SDL_AXIS.RIGHTY] ?? 0) };
  return state;
};

export { padStateOf };
