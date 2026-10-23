/* @layer tooling-scripts @kind logic */
import { patternTodos } from '../../src/upgrade/index.mjs';

const RULES = Object.freeze([
  {
    pattern: /\bmatchesShortcut\b/g,
    message: "Brock 0.76 removed matchesShortcut. Declare the shortcut as a command (defineCommand with a chord, registered through BrockApp commands or useCommands) and let the dispatcher run it, or test an event with commands.matches('<command id>', event).",
  },
  {
    pattern: /\bparseShortcut\b/g,
    message: 'Brock 0.76 removed parseShortcut. Read the chords of a command with commands.chords(id) or useCommandChords(id), and show one with formatChord(chord).',
  },
  {
    pattern: /\bParsedShortcut\b/g,
    message: 'Brock 0.76 removed the ParsedShortcut type. Keep chords as strings, such as "Mod+Shift+S", and use commands.chords(id) and formatChord(chord).',
  },
]);

const apply = ({ source }) => ({ source, todos: patternTodos(source, RULES) });

const migration = Object.freeze({
  id: 'shortcut-helpers-removed',
  summary: 'Brock 0.76 moves every shortcut onto the command registry: each use of matchesShortcut, parseShortcut and ParsedShortcut becomes a to-do pointing at commands and formatChord. Mod now means only the platform key (Ctrl on Windows and Linux, Cmd on macOS), so Win+K no longer opens Search on Windows.',
  files: /\.[jt]sx?$/,
  apply,
});

export { migration };
