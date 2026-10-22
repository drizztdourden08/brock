/* @layer core @kind logic */
import { SDL_BUTTON_NAMES } from '../input.constants';
import type { SdlButtonName } from './sdl-button-name.type';

const isButtonDown = (buttons: readonly boolean[], name: SdlButtonName): boolean =>
  buttons[SDL_BUTTON_NAMES.indexOf(name)] === true;

export { isButtonDown };
