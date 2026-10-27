/* @layer renderer-shell @kind constants */
import type { CommandDef } from './command.type';

const MOD = 'Mod';

const MODIFIERS: Readonly<Record<string, 'mod' | 'ctrl' | 'alt' | 'shift' | 'meta'>> = {
  mod: 'mod', ctrl: 'ctrl', control: 'ctrl', alt: 'alt', option: 'alt', opt: 'alt', shift: 'shift', meta: 'meta', cmd: 'meta', command: 'meta', win: 'meta', super: 'meta',
};

const KEY_TOKENS: Readonly<Record<string, string>> = {
  esc: 'Escape', escape: 'Escape', enter: 'Enter', return: 'Enter', space: 'Space', ' ': 'Space', tab: 'Tab', backspace: 'Backspace', delete: 'Delete', del: 'Delete',
  insert: 'Insert', home: 'Home', end: 'End', pageup: 'PageUp', pagedown: 'PageDown', pgup: 'PageUp', pgdn: 'PageDown',
  up: 'Up', arrowup: 'Up', down: 'Down', arrowdown: 'Down', left: 'Left', arrowleft: 'Left', right: 'Right', arrowright: 'Right',
  contextmenu: 'ContextMenu', menu: 'ContextMenu',
  comma: ',', period: '.', slash: '/', backslash: '\\', plus: '+', minus: '-', equal: '=', semicolon: ';', quote: '\'', backquote: '`', bracketleft: '[', bracketright: ']',
};

const CODE_KEYS: Readonly<Record<string, string>> = {
  Slash: '/', Backslash: '\\', Comma: ',', Period: '.', Minus: '-', Equal: '=', Semicolon: ';', Quote: '\'', Backquote: '`', BracketLeft: '[', BracketRight: ']', Space: 'Space',
};

const CODE_PREFIXES: readonly string[] = ['Key', 'Digit'];

const FUNCTION_KEY = /^f([1-9]|1\d|2[0-4])$/i;

const MODIFIER_ORDER = ['ctrl', 'alt', 'shift', 'meta'] as const;

const MODIFIER_NAMES = {
  mac: { ctrl: 'Ctrl', alt: 'Option', shift: 'Shift', meta: 'Cmd' },
  other: { ctrl: 'Ctrl', alt: 'Alt', shift: 'Shift', meta: 'Win' },
} as const;

const MODIFIER_CAPS = {
  mac: { ctrl: 'ctrl', alt: 'alt', shift: 'shift', meta: 'cmd' },
  other: { ctrl: 'ctrl', alt: 'alt', shift: 'shift', meta: 'win' },
} as const;

const CAP_PARTS: Readonly<Partial<Record<string, string>>> = { ctrl: 'Ctrl', cmd: 'Meta', win: 'Meta', alt: 'Alt', option: 'Alt', shift: 'Shift', '+': 'Plus' };

const MAC_PLATFORM = /mac|iphone|ipad/i;

const GENERAL_GROUP = 'General';
const SCREENS_GROUP = 'Screens and pages';
const COMMANDS_GROUP = 'Commands';

const OPEN_COMMAND_PREFIX = 'open:';

const BROCK_COMMANDS = {
  search: 'brock.search',
  shortcuts: 'brock.shortcuts',
  fullscreen: 'brock.fullscreen',
  back: 'brock.back',
  contextMenu: 'brock.context-menu',
} as const;

const COMMAND_RANKS = { brock: 0, app: 1, routes: 2, runtime: 3 } as const;

const KEYMAP_SETTING = 'keymap';

const NO_CHORDS: readonly string[] = [];

const NO_COMMANDS: readonly CommandDef[] = [];

const UNKNOWN_REASON = 'No such command.';

const GATED_REASON = 'This command is not available right now.';

const KEYMAP_ROOT = 'data-brock-keymap';

const COMMAND_ZONE_ATTRIBUTE = 'data-command-zone';

export {
  BROCK_COMMANDS, CAP_PARTS, CODE_KEYS, CODE_PREFIXES, COMMAND_RANKS, COMMAND_ZONE_ATTRIBUTE, COMMANDS_GROUP, FUNCTION_KEY, GENERAL_GROUP, KEY_TOKENS, KEYMAP_ROOT, KEYMAP_SETTING, MAC_PLATFORM, MOD,
  MODIFIER_CAPS, MODIFIER_NAMES, MODIFIER_ORDER, MODIFIERS, NO_CHORDS, NO_COMMANDS, OPEN_COMMAND_PREFIX, SCREENS_GROUP, UNKNOWN_REASON, GATED_REASON
};
