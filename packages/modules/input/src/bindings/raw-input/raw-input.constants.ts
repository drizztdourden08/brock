/* @layer core @kind constants */
import { SDL_AXIS } from '../../sdl/sdl-buttons.constants';

const STICK_DIRECTION_PRESS_THRESHOLD = 0.5;

const TRIGGER_AXIS_INDICES: readonly number[] = [SDL_AXIS.LEFT_TRIGGER, SDL_AXIS.RIGHT_TRIGGER];

export { STICK_DIRECTION_PRESS_THRESHOLD, TRIGGER_AXIS_INDICES };
