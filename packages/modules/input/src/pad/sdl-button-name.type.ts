/* @layer core @kind types */
import type { SDL_BUTTON_NAMES } from '../input.constants';

type SdlButtonName = (typeof SDL_BUTTON_NAMES)[number];

export type { SdlButtonName };
