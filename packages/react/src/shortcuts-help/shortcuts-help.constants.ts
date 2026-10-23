/* @layer renderer-shell @kind constants */
import { BROCK_COMMANDS } from '../commands/commands.constants';
import type { MenuItem } from '../menu/menu.type';
import type { ShortcutRow } from './shortcuts-help.type';

const SHORTCUTS_HELP_LABEL = 'Keyboard shortcuts';
const SHORTCUTS_HELP_CHORD = 'Mod+/';

const SHORTCUTS_HELP_ENTRY: Omit<MenuItem, 'onClick'> = {
  key: 'keyboard-shortcuts', label: SHORTCUTS_HELP_LABEL, icon: 'keyboard', section: 'advanced', command: BROCK_COMMANDS.shortcuts,
};

const ESCAPE_ROW: ShortcutRow = { label: 'Clear a text field, then close the top layer or go home', shortcut: 'Esc' };

export { ESCAPE_ROW, SHORTCUTS_HELP_CHORD, SHORTCUTS_HELP_ENTRY, SHORTCUTS_HELP_LABEL };
