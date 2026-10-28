/* @layer renderer-shell @kind logic */
import type { ContextMenuContext } from '../context-menu/context-menu.type';
import { toolbarIdOf } from './toolbar-id-of';
import { toolbarMenuLabel } from './toolbar-menu-label';

const toolbarItemLabel = (context: ContextMenuContext): string => toolbarMenuLabel({ ...context, data: toolbarIdOf(context.target) });

export { toolbarItemLabel };
