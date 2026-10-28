/* @layer renderer-shell @kind logic */
import type { ContextMenuContext, ContextMenuEntry } from '../context-menu/context-menu.type';
import { toolbarContextEntries } from './toolbar-context-entries';
import { toolbarIdOf } from './toolbar-id-of';
import { useToolbarLayoutStore } from './useToolbarLayoutStore';

const toolbarItemEntries = (context: ContextMenuContext): ContextMenuEntry[] => {
  const toolbarId = toolbarIdOf(context.target);
  const itemId = typeof context.data === 'string' ? context.data : null;
  if (toolbarId === null) return [];
  const own = itemId === null ? [] : (useToolbarLayoutStore.getState().definitions.find((def) => def.id === toolbarId)?.contextEntries?.(itemId) ?? []);
  const brock = toolbarContextEntries({ ...context, data: toolbarId });
  return own.length === 0 ? brock : [...own, 'separator', ...brock];
};

export { toolbarItemEntries };
