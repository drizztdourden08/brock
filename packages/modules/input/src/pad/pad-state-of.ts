/* @layer core @kind logic */
import { SDL_AXIS, SDL_BUTTON_NAMES } from '../input.constants';
import type { SdlButtonName } from './pad-slots.constants.type';
import type { PadState } from './controller-slot.type';
import { BUTTON_SLOTS } from './pad-slots.constants';

const isDown = (buttons: readonly boolean[], name: SdlButtonName): boolean =>
  buttons[SDL_BUTTON_NAMES.indexOf(name)] === true;

const up = (value: number): number => (value === 0 ? 0 : -value);

const padStateOf = (buttons: readonly boolean[], axes: readonly number[]): PadState => {
  const state: PadState = {};
  for (const [slot, name] of BUTTON_SLOTS) state[slot] = { pressed: isDown(buttons, name) };
  state['trigger.left'] = { value: axes[SDL_AXIS.LEFT_TRIGGER] ?? 0 };
  state['trigger.right'] = { value: axes[SDL_AXIS.RIGHT_TRIGGER] ?? 0 };
  state['stick.left'] = { x: axes[SDL_AXIS.LEFTX] ?? 0, y: up(axes[SDL_AXIS.LEFTY] ?? 0) };
  state['stick.right'] = { x: axes[SDL_AXIS.RIGHTX] ?? 0, y: up(axes[SDL_AXIS.RIGHTY] ?? 0) };
  return state;
};

export { padStateOf };
