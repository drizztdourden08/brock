/* @layer renderer-shell @kind logic */
import { contextMenuZone } from '../context-menu/context-menu-zone';
import type { ContextMenuAttributes } from '../context-menu/context-menu.type';
import { TOOLBAR_ITEM_ZONE } from './toolbar.constants';

const toolbarItemZone = (itemId: string): ContextMenuAttributes => contextMenuZone(TOOLBAR_ITEM_ZONE, { data: itemId });

export { toolbarItemZone };
