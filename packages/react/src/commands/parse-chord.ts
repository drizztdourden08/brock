/* @layer renderer-shell @kind logic */
import { chordKey } from './chord-key';
import { MODIFIERS } from './commands.constants';
import type { ParsedChord } from './command.type';
import { splitChord } from './split-chord';

const parseChord = (chord: string, mac: boolean): ParsedChord | null => {
  const parts = splitChord(chord);
  const key = parts.pop();
  if (key === undefined || MODIFIERS[key.toLowerCase()] !== undefined) return null;
  const held = parts.map((part) => MODIFIERS[part.toLowerCase()]);
  if (held.includes(undefined)) return null;
  const mod = held.includes('mod');
  return {
    ctrl: held.includes('ctrl') || (mod && !mac),
    meta: held.includes('meta') || (mod && mac),
    alt: held.includes('alt'),
    shift: held.includes('shift'),
    key: chordKey(key),
  };
};

export { parseChord };
