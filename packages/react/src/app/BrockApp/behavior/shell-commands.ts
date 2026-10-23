/* @layer renderer-shell @kind logic */
import { BROCK_COMMANDS, GENERAL_GROUP } from '../../../commands/commands.constants';
import type { CommandDef } from '../../../commands/command.type';
import { nav } from '../../../navigation/nav';
import { palette } from '../../../palette/palette';
import { shortcutsHelp } from '../../../shortcuts-help/shortcuts-help';
import { SHORTCUTS_HELP_CHORD, SHORTCUTS_HELP_LABEL } from '../../../shortcuts-help/shortcuts-help.constants';

const shellCommands = (toggleFullscreen: (() => void) | undefined): CommandDef[] => [
  { id: BROCK_COMMANDS.search, label: 'Search', icon: 'search', group: GENERAL_GROUP, chord: 'Mod+K', whileTyping: true, run: palette.toggle },
  { id: BROCK_COMMANDS.shortcuts, label: SHORTCUTS_HELP_LABEL, icon: 'keyboard', group: GENERAL_GROUP, chord: SHORTCUTS_HELP_CHORD, run: shortcutsHelp.toggle },
  ...(toggleFullscreen === undefined ? [] : [{ id: BROCK_COMMANDS.fullscreen, label: 'Toggle fullscreen', group: GENERAL_GROUP, chord: 'Alt+Enter', whileTyping: true, run: toggleFullscreen }]),
  { id: BROCK_COMMANDS.back, label: 'Go back', group: GENERAL_GROUP, chord: 'Alt+Left', whileTyping: true, run: () => { nav.back(); } },
];

export { shellCommands };
