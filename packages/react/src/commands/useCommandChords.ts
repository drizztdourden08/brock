/* @layer renderer-shell @kind hook */
import { NO_CHORDS } from './commands.constants';
import { useChordLookup } from './useChordLookup';

const useCommandChords = (id: string): readonly string[] => useChordLookup()(id) ?? NO_CHORDS;

export { useCommandChords };
