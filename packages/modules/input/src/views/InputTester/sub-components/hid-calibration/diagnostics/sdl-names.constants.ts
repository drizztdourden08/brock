/* @layer renderer-shell @kind constants */
import { SDL_AXIS, SDL_BUTTON } from '../../../../../sdl/sdl-buttons.constants';
import type { SdlAxisName } from '../../../../../sdl/sdl-buttons.type';
import type { SdlButtonName } from '../../../../../pad/sdl-button-name.type';

const BUTTON_NAME_BY_INDEX = Object.fromEntries(Object.entries(SDL_BUTTON).map(([name, index]) => [index, name])) as Record<number, SdlButtonName>;
const AXIS_NAME_BY_INDEX = Object.fromEntries(Object.entries(SDL_AXIS).map(([name, index]) => [index, name])) as Record<number, SdlAxisName>;

export { BUTTON_NAME_BY_INDEX, AXIS_NAME_BY_INDEX };
