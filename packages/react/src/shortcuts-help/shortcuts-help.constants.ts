/* @layer renderer-shell @kind constants */
import { msg } from '@drizztdourden08/brock-core/i18n';
import { BROCK_COMMANDS } from '../commands/commands.constants';
import type { MenuItemDef } from '../menu/menu.type';
import type { ShortcutRow } from './shortcuts-help.type';

const SHORTCUTS_HELP_LABEL = msg('brock-settings:shortcuts.title');
const SHORTCUTS_HELP_CHORD = 'Mod+/';

const SHORTCUTS_HELP_ENTRY: Omit<MenuItemDef, 'onClick'> = {
  key: 'keyboard-shortcuts', label: SHORTCUTS_HELP_LABEL, icon: 'keyboard', section: 'advanced', command: BROCK_COMMANDS.shortcuts,
};

const ESCAPE_ROW: ShortcutRow = { label: msg('brock-settings:shortcuts.escape'), shortcut: 'Esc' };

export { ESCAPE_ROW, SHORTCUTS_HELP_CHORD, SHORTCUTS_HELP_ENTRY, SHORTCUTS_HELP_LABEL };
