/* @layer renderer-shell @kind logic */
import type { ParsedChord } from './command.type';
import { MOD } from './commands.constants';
import { parseChord } from './parse-chord';

const keyName = (key: string): string => (key === '+' ? 'Plus' : key);

const modifierParts = (parsed: ParsedChord, mac: boolean): string[] => {
  const primary = mac ? parsed.meta : parsed.ctrl;
  const secondary = mac ? parsed.ctrl : parsed.meta;
  const secondName = mac ? 'Ctrl' : 'Meta';
  return [primary ? MOD : '', secondary ? secondName : '', parsed.alt ? 'Alt' : '', parsed.shift ? 'Shift' : ''];
};

const normalizeChord = (chord: string, mac: boolean): string | null => {
  const parsed = parseChord(chord, mac);
  if (parsed === null) return null;
  const parts = [...modifierParts(parsed, mac), ...(parsed.with ?? []).map(keyName), keyName(parsed.key)];
  return parts.filter(Boolean).join('+');
};

export { normalizeChord };
