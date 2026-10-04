/* @layer renderer-shell @kind constants */
import type { MenuItem } from '../menu/menu.type';
import type { ShortcutKey } from '@drizztdourden08/tessera/primitives';
import type { ShortcutRow } from './shortcuts-help.type';

const SHORTCUTS_HELP_LABEL = 'Keyboard shortcuts';
const SHORTCUTS_HELP_CHORD = 'Mod+/';
const FULLSCREEN_CHORD = 'Alt+Enter';
const GENERAL_GROUP = 'General';
const SCREENS_GROUP = 'Screens and pages';

const SHORTCUTS_HELP_ENTRY: Omit<MenuItem, 'onClick'> = {
  key: 'keyboard-shortcuts', label: SHORTCUTS_HELP_LABEL, icon: 'keyboard', section: 'advanced', shortcut: SHORTCUTS_HELP_CHORD,
};

const FRAMEWORK_SHORTCUTS: readonly ShortcutRow[] = [
  { label: 'Search', shortcut: 'Mod+K' },
  { label: 'Clear a text field, then close the top layer or go home', shortcut: 'Esc' },
  { label: 'Toggle fullscreen', shortcut: FULLSCREEN_CHORD },
  { label: SHORTCUTS_HELP_LABEL, shortcut: SHORTCUTS_HELP_CHORD },
];

const KEY_NAMES: Readonly<Record<string, ShortcutKey>> = {
  mod: 'ctrl', ctrl: 'ctrl', control: 'ctrl', shift: 'shift', alt: 'alt', meta: 'cmd', cmd: 'cmd',
  esc: 'esc', escape: 'esc', enter: 'enter', return: 'enter', tab: 'tab', space: 'space', backspace: 'backspace', delete: 'delete',
  home: 'home', end: 'end', pageup: 'pageup', pagedown: 'pagedown', up: 'up', down: 'down', left: 'left', right: 'right',
  arrowup: 'up', arrowdown: 'down', arrowleft: 'left', arrowright: 'right', comma: ',', period: '.', slash: '/',
};

export {
  FRAMEWORK_SHORTCUTS, FULLSCREEN_CHORD, GENERAL_GROUP, KEY_NAMES, SCREENS_GROUP, SHORTCUTS_HELP_ENTRY,
  SHORTCUTS_HELP_LABEL,
};
