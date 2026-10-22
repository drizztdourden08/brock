/* @layer core @kind logic */
import { SDL_AXIS, SDL_BUTTON_NAMES } from '../input.constants';
import type { SdlButtonName } from './sdl-button-name.type';
import type { PadSlots, PadState } from './controller-slot.type';
import { BUTTON_SLOTS, EXTRA_BUTTONS } from './pad-slots.constants';

const isDown = (buttons: readonly boolean[], name: SdlButtonName): boolean =>
  buttons[SDL_BUTTON_NAMES.indexOf(name)] === true;

const up = (value: number): number => (value === 0 ? 0 : -value);

const padStateOf = (buttons: readonly boolean[], axes: readonly number[]): PadState => {
  const slots: PadSlots = {};
  for (const [slot, name] of BUTTON_SLOTS) slots[slot] = { pressed: isDown(buttons, name) };
  slots['trigger.left'] = { value: axes[SDL_AXIS.LEFT_TRIGGER] ?? 0 };
  slots['trigger.right'] = { value: axes[SDL_AXIS.RIGHT_TRIGGER] ?? 0 };
  slots['stick.left'] = { x: axes[SDL_AXIS.LEFTX] ?? 0, y: up(axes[SDL_AXIS.LEFTY] ?? 0) };
  slots['stick.right'] = { x: axes[SDL_AXIS.RIGHTX] ?? 0, y: up(axes[SDL_AXIS.RIGHTY] ?? 0) };
  const extras = EXTRA_BUTTONS.map(([id, label, name]) => ({ id, label, pressed: isDown(buttons, name) }));
  return { slots, extras };
};

export { padStateOf };
