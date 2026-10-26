/* @layer renderer-shell @kind hook */
import { useContextMenu } from '../context-menu/useContextMenu';
import { toolbarContextEntries } from './toolbar-context-entries';
import { toolbarMenuLabel } from './toolbar-menu-label';
import { TOOLBAR_ZONE } from './toolbar.constants';

const useToolbarContextMenu = (): void => {
  useContextMenu(TOOLBAR_ZONE, { entries: toolbarContextEntries, label: toolbarMenuLabel });
};

export { useToolbarContextMenu };
