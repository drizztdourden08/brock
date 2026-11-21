/* @layer renderer-shell @kind types */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { ChordLookup } from '../commands/command.type';

interface TitleBarFoldState {
  enabled: (commandId: string) => boolean;
  chords: ChordLookup;
  text: (value: Text) => string;
}

export type { TitleBarFoldState };
