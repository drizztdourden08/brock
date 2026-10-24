/* @layer renderer-shell @kind constants */
import type { MenuItem } from '../menu/menu.type';
import type { ToolbarDef } from './toolbar.type';

const NO_TOOLBARS: readonly ToolbarDef[] = [];
const TOOLBAR_KEY_PREFIX = 'toolbar-';
const TOOLBARS_MENU_KEY = 'toolbars';
const TOOLBARS_MENU_ICON = 'panel-top';
const RESET_TOOLBARS_KEY = 'toolbars-reset';
const RESET_TOOLBARS_ENTRY: Omit<MenuItem, 'onClick'> = { key: RESET_TOOLBARS_KEY, label: 'Reset toolbars', icon: 'rotate-ccw', confirm: true };

export { NO_TOOLBARS, RESET_TOOLBARS_ENTRY, TOOLBAR_KEY_PREFIX, TOOLBARS_MENU_ICON, TOOLBARS_MENU_KEY };
