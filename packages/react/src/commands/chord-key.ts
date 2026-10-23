/* @layer renderer-shell @kind logic */
import { FUNCTION_KEY, KEY_TOKENS } from './commands.constants';

const chordKey = (raw: string): string => {
  const lower = raw.toLowerCase();
  const named = KEY_TOKENS[lower];
  if (named !== undefined) return named;
  if (FUNCTION_KEY.test(raw) || raw.length === 1) return raw.toUpperCase();
  return lower;
};

export { chordKey };
