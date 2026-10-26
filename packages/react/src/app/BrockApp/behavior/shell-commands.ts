/* @layer renderer-shell @kind logic */
import { BROCK_COMMANDS, GENERAL_GROUP } from '../../../commands/commands.constants';
import type { CommandDef } from '../../../commands/command.type';
import { CONTEXT_MENU_CHORDS, CONTEXT_MENU_LABEL, CONTEXT_MENU_ZONE } from '../../../context-menu/context-menu.constants';
import { openFromFocus } from '../../../context-menu/open-from-focus';
import { nav } from '../../../navigation/nav';
import { palette } from '../../../palette/palette';
import { shortcutsHelp } from '../../../shortcuts-help/shortcuts-help';
import { SHORTCUTS_HELP_CHORD, SHORTCUTS_HELP_LABEL } from '../../../shortcuts-help/shortcuts-help.constants';
import { cycleRegion } from '../../../regions/cycle-region';
import { REGION_COMMANDS, REGION_TEXT } from '../../../regions/regions.constants';

const shellCommands = (toggleFullscreen: (() => void) | undefined): CommandDef[] => [
  { id: BROCK_COMMANDS.search, label: 'Search', icon: 'search', group: GENERAL_GROUP, chord: 'Mod+K', whileTyping: true, run: palette.toggle },
  { id: BROCK_COMMANDS.shortcuts, label: SHORTCUTS_HELP_LABEL, icon: 'keyboard', group: GENERAL_GROUP, chord: SHORTCUTS_HELP_CHORD, run: shortcutsHelp.toggle },
  ...(toggleFullscreen === undefined ? [] : [{ id: BROCK_COMMANDS.fullscreen, label: 'Toggle fullscreen', group: GENERAL_GROUP, chord: ['F11', 'Alt+Enter'], whileTyping: true, run: toggleFullscreen }]),
  { id: BROCK_COMMANDS.back, label: 'Go back', group: GENERAL_GROUP, chord: 'Alt+Left', whileTyping: true, run: () => { nav.back(); } },
  { id: BROCK_COMMANDS.contextMenu, label: CONTEXT_MENU_LABEL, group: GENERAL_GROUP, chord: CONTEXT_MENU_CHORDS, zone: CONTEXT_MENU_ZONE, whileTyping: true, run: openFromFocus },
  { id: REGION_COMMANDS.next, label: REGION_TEXT.next, group: GENERAL_GROUP, chord: 'F6', whileTyping: true, run: () => cycleRegion(1) },
  { id: REGION_COMMANDS.previous, label: REGION_TEXT.previous, group: GENERAL_GROUP, chord: 'Shift+F6', whileTyping: true, run: () => cycleRegion(-1) },
];

export { shellCommands };
