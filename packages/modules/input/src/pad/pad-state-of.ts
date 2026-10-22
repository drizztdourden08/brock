/* @layer core @kind logic */
import { SDL_AXIS } from '../input.constants';
import type { PadDevice, PadSlots, PadState } from './controller-slot.type';
import { isButtonDown } from './is-button-down';
import { padExtrasOf } from './pad-extras-of';
import { BUTTON_SLOTS } from './pad-slots.constants';

const up = (value: number): number => (value === 0 ? 0 : -value);

const padStateOf = (buttons: readonly boolean[], axes: readonly number[], device?: PadDevice): PadState => {
  const slots: PadSlots = {};
  for (const [slot, name] of BUTTON_SLOTS) slots[slot] = { pressed: isButtonDown(buttons, name) };
  slots['trigger.left'] = { value: axes[SDL_AXIS.LEFT_TRIGGER] ?? 0 };
  slots['trigger.right'] = { value: axes[SDL_AXIS.RIGHT_TRIGGER] ?? 0 };
  slots['stick.left'] = { x: axes[SDL_AXIS.LEFTX] ?? 0, y: up(axes[SDL_AXIS.LEFTY] ?? 0) };
  slots['stick.right'] = { x: axes[SDL_AXIS.RIGHTX] ?? 0, y: up(axes[SDL_AXIS.RIGHTY] ?? 0) };
  return { slots, extras: padExtrasOf(buttons, device) };
};

export { padStateOf };
