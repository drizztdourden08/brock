/* @layer renderer-shell @kind logic */
import { contextMenuZone } from '../context-menu/context-menu-zone';
import type { ContextMenuAttributes } from '../context-menu/context-menu.type';
import { TOOLBAR_ID_ATTRIBUTE, TOOLBAR_ITEM_ZONE } from './toolbar.constants';

const toolbarItemZone = (itemId: string): ContextMenuAttributes => contextMenuZone(TOOLBAR_ITEM_ZONE, { data: itemId });

const toolbarIdOf = (target: Element | null): string | null => target?.closest(`[${TOOLBAR_ID_ATTRIBUTE}]`)?.getAttribute(TOOLBAR_ID_ATTRIBUTE) ?? null;

export { toolbarIdOf, toolbarItemZone };
