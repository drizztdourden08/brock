/* @layer renderer-shell @kind logic */
import type { ContextMenuContext } from '../context-menu/context-menu.type';
import { toolbarIdOf } from './toolbar-item-zone';
import { TOOLBAR_TEXT } from './toolbar.constants';
import { useToolbarLayoutStore } from './useToolbarLayoutStore';

const toolbarMenuLabel = (context: ContextMenuContext): string => {
  const found = useToolbarLayoutStore.getState().definitions.find((definition) => definition.id === context.data);
  return found === undefined ? TOOLBAR_TEXT.toolbar : `${found.label} ${TOOLBAR_TEXT.toolbar.toLowerCase()}`;
};

const toolbarItemLabel = (context: ContextMenuContext): string => toolbarMenuLabel({ ...context, data: toolbarIdOf(context.target) });

export { toolbarItemLabel, toolbarMenuLabel };
