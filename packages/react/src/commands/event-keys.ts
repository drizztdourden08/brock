/* @layer renderer-shell @kind logic */
import { chordKey } from './chord-key';
import { CODE_KEYS, CODE_PREFIXES } from './commands.constants';
import type { ChordEvent } from './command.type';

const codeKey = (code: string): string | undefined => {
  const mapped = CODE_KEYS[code];
  if (mapped !== undefined) return mapped;
  const prefix = CODE_PREFIXES.find((start) => code.startsWith(start) && code.length === start.length + 1);
  return prefix === undefined ? undefined : code.slice(prefix.length);
};

const eventKeys = (event: Pick<ChordEvent, 'key' | 'code'>): string[] => {
  const physical = codeKey(event.code);
  return [chordKey(event.key), ...(physical === undefined ? [] : [physical])];
};

export { eventKeys };
