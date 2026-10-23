/* @layer renderer-shell @kind logic */
import { normalizeChord } from './normalize-chord';

const normalizeChords = (chords: readonly string[], mac: boolean): string[] =>
  [...new Set(chords.flatMap((chord) => normalizeChord(chord, mac) ?? []))];

export { normalizeChords };
