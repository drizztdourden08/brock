/* @layer core @kind types */
import type { SDL_AXIS, SDL_GAMEPAD_TYPES } from './sdl-buttons.constants';

type SdlAxisName = keyof typeof SDL_AXIS;
type SdlGamepadType = (typeof SDL_GAMEPAD_TYPES)[number];

export type { SdlAxisName, SdlGamepadType };
