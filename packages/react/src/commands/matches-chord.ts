/* @layer renderer-shell @kind logic */
import { chordKey } from './chord-key';
import type { ChordEvent } from './command.type';
import { eventKeys } from './event-keys';
import { parseChord } from './parse-chord';

const isSymbol = (key: string): boolean => key.length === 1 && !/[A-Z0-9]/.test(key);

const matchesChord = (event: ChordEvent, chord: string, mac: boolean): boolean => {
  const want = parseChord(chord, mac);
  if (want === null) return false;
  if (event.ctrlKey !== want.ctrl || event.metaKey !== want.meta || event.altKey !== want.alt) return false;
  if (!eventKeys(event).includes(want.key)) return false;
  const typedSymbol = !want.shift && isSymbol(want.key) && chordKey(event.key) === want.key;
  return event.shiftKey === want.shift || typedSymbol;
};

export { matchesChord };
