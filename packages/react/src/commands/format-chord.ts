/* @layer renderer-shell @kind logic */
import { MODIFIER_NAMES } from './commands.constants';
import { heldModifiers } from './held-modifiers';
import { parseChord } from './parse-chord';

const formatChord = (chord: string, mac: boolean): string => {
  const parsed = parseChord(chord, mac);
  if (parsed === null) return chord;
  const names = mac ? MODIFIER_NAMES.mac : MODIFIER_NAMES.other;
  return [...heldModifiers(parsed).map((name) => names[name]), parsed.key].join('+');
};

export { formatChord };
