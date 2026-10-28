/* @layer renderer-shell @kind hook */
import { useContextMenu } from '../context-menu/useContextMenu';
import { toolbarContextEntries } from './toolbar-context-entries';
import { toolbarItemEntries } from './toolbar-item-entries';
import { toolbarItemLabel } from './toolbar-item-label';
import { toolbarMenuLabel } from './toolbar-menu-label';
import { TOOLBAR_ITEM_ZONE, TOOLBAR_ZONE } from './toolbar.constants';

const useToolbarContextMenu = (): void => {
  useContextMenu(TOOLBAR_ZONE, { entries: toolbarContextEntries, label: toolbarMenuLabel });
  useContextMenu(TOOLBAR_ITEM_ZONE, { entries: toolbarItemEntries, label: toolbarItemLabel });
};

export { useToolbarContextMenu };
