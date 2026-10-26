/* @layer renderer-shell @kind logic */
import type { ShortcutKey } from '@drizztdourden08/tessera/primitives';
import { FUNCTION_KEY, MODIFIER_CAPS } from './commands.constants';
import { heldModifiers } from './held-modifiers';
import { isMac } from './is-mac';
import { parseChord } from './parse-chord';

const keycapOf = (key: string): ShortcutKey => {
  if (key === 'Escape') return 'esc';
  if (key === 'ContextMenu') return 'menu';
  if (key.length === 1 || FUNCTION_KEY.test(key)) return key as ShortcutKey;
  return key.toLowerCase() as ShortcutKey;
};

const chordKeys = (chord: string, mac: boolean = isMac()): ShortcutKey[] => {
  const parsed = parseChord(chord, mac);
  if (parsed === null) return [];
  const caps = mac ? MODIFIER_CAPS.mac : MODIFIER_CAPS.other;
  return [...heldModifiers(parsed).map((name) => caps[name]), keycapOf(parsed.key)];
};

export { chordKeys };
