/* @layer renderer-shell @kind logic */
import { CONTEXT_MENU_ATTRIBUTE, CONTEXT_MENU_DATA_ATTRIBUTE, CONTEXT_MENU_TYPING_ATTRIBUTE } from './context-menu.constants';
import type { ContextMenuAttributes, ContextMenuZoneOptions } from './context-menu.type';

const contextMenuZone = (zone: string, options: ContextMenuZoneOptions = {}): ContextMenuAttributes => ({
  [CONTEXT_MENU_ATTRIBUTE]: zone,
  'aria-haspopup': 'menu',
  ...(options.data === undefined ? {} : { [CONTEXT_MENU_DATA_ATTRIBUTE]: JSON.stringify(options.data) }),
  ...(options.typing === true ? { [CONTEXT_MENU_TYPING_ATTRIBUTE]: '' as const } : {}),
  ...(options.focusable === true ? { tabIndex: 0 as const } : {}),
});

export { contextMenuZone };
