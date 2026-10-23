/* @layer renderer-shell @kind logic */
import type { ShortcutKey } from '@drizztdourden08/tessera/primitives';
import { CAP_PARTS } from './commands.constants';
import { normalizeChord } from './normalize-chord';

const chordOfKeys = (keys: readonly ShortcutKey[], mac: boolean): string | null =>
  normalizeChord(keys.map((key) => CAP_PARTS[key] ?? key).join('+'), mac);

export { chordOfKeys };
