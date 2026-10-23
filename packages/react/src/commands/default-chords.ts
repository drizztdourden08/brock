/* @layer renderer-shell @kind logic */
import type { ChordList, CommandDef } from './command.type';
import { normalizeChords } from './normalize-chords';

const listOf = (chords: ChordList): readonly string[] => (typeof chords === 'string' ? [chords] : chords);

const defaultChords = (def: Pick<CommandDef, 'chord'>, mac: boolean): string[] => {
  const { chord } = def;
  if (chord === undefined) return [];
  if (typeof chord === 'object' && 'mac' in chord) return normalizeChords(listOf(mac ? chord.mac : chord.other), mac);
  return normalizeChords(listOf(chord), mac);
};

export { defaultChords };
