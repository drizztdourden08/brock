/* @layer renderer-shell @kind types */
import type { ChordLookup } from '../commands/command.type';

interface TitleBarFoldState {
  enabled: (commandId: string) => boolean;
  chords: ChordLookup;
}

export type { TitleBarFoldState };
