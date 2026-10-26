/* @layer renderer-shell @kind constants */
import type { ToolbarSide } from '@drizztdourden08/tessera/composites';
import type { MenuItem } from '../menu/menu.type';
import type { ToolbarDef } from './toolbar.type';

const NO_TOOLBARS: readonly ToolbarDef[] = [];
const TOOLBAR_KEY_PREFIX = 'toolbar-';
const TOOLBARS_MENU_KEY = 'toolbars';
const TOOLBARS_MENU_ICON = 'panel-top';
const RESET_TOOLBARS_KEY = 'toolbars-reset';
const RESET_TOOLBARS_ENTRY: Omit<MenuItem, 'onClick'> = { key: RESET_TOOLBARS_KEY, label: 'Reset toolbars', icon: 'rotate-ccw', confirm: true };
const TOOLBAR_COMMANDS = { hide: 'toolbar.hide', labels: 'toolbar.labels', moveTo: 'toolbar.moveTo' } as const;
const TOOLBAR_GROUP = 'Toolbars';
const TOOLBAR_ZONE = 'brock.toolbar';
const TOOLBAR_SIDE_ORDER: readonly ToolbarSide[] = ['top', 'bottom', 'left', 'right'];
const TOOLBAR_SIDE_WORDS: Readonly<Record<ToolbarSide, string>> = { top: 'Top', bottom: 'Bottom', left: 'Left', right: 'Right' };
const TOOLBAR_TEXT = {
  toolbar: 'Toolbar',
  labels: 'Show labels',
  hide: 'Hide toolbar',
  moveTo: 'Move to',
  noRoom: 'No room on that side',
} as const;

export {
  NO_TOOLBARS, RESET_TOOLBARS_ENTRY, TOOLBAR_COMMANDS, TOOLBAR_GROUP, TOOLBAR_KEY_PREFIX, TOOLBAR_SIDE_ORDER, TOOLBAR_SIDE_WORDS, TOOLBAR_TEXT, TOOLBAR_ZONE, TOOLBARS_MENU_ICON, TOOLBARS_MENU_KEY,
};
