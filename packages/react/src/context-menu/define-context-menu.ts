/* @layer renderer-shell @kind logic */
import type { ContextMenuSource } from './context-menu.type';
import { normalizeSource } from './normalize-source';
import { useContextMenuStore } from './useContextMenuStore';

const defineContextMenu = (zone: string, source: ContextMenuSource): void => useContextMenuStore.getState().define(zone, normalizeSource(source));

export { defineContextMenu };
