/* @layer renderer-shell @kind logic */
import { SHORTCUT_DISPLAY } from './menu.constants';

const menuShortcut = (shortcut: string): string =>
  shortcut.split('+').map((part) => SHORTCUT_DISPLAY[part.trim().toLowerCase()] ?? part.trim()).join('+');

export { menuShortcut };
