/* @layer renderer-shell @kind logic */
import { MOD } from './commands.constants';
import { parseChord } from './parse-chord';

const normalizeChord = (chord: string, mac: boolean): string | null => {
  const parsed = parseChord(chord, mac);
  if (parsed === null) return null;
  const primary = mac ? parsed.meta : parsed.ctrl;
  const secondary = mac ? parsed.ctrl : parsed.meta;
  const secondName = mac ? 'Ctrl' : 'Meta';
  const parts = [
    primary ? MOD : '',
    secondary ? secondName : '',
    parsed.alt ? 'Alt' : '',
    parsed.shift ? 'Shift' : '',
    parsed.key === '+' ? 'Plus' : parsed.key,
  ];
  return parts.filter(Boolean).join('+');
};

export { normalizeChord };
