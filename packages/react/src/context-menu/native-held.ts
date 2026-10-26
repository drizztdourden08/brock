/* @layer renderer-shell @kind logic */
import { isTyping } from '../commands/is-typing';
import { CONTEXT_MENU_TYPING_ATTRIBUTE, NATIVE_MENU_ATTRIBUTE } from './context-menu.constants';

const nativeHeld = (target: EventTarget | null): boolean => {
  if (!(target instanceof Element)) return false;
  if (target.closest(`[${NATIVE_MENU_ATTRIBUTE}]`) !== null) return true;
  return isTyping(target) && target.closest(`[${CONTEXT_MENU_TYPING_ATTRIBUTE}]`) === null;
};

export { nativeHeld };
