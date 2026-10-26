/* @layer electron-main @kind logic */
import { HIDDEN_CODE_RANGES, TERMINAL_SEQUENCES } from './process-job.constants';

const shown = (char: string): boolean => {
  const code = char.codePointAt(0) ?? 0;
  return !HIDDEN_CODE_RANGES.some(([from, to]) => code >= from && code <= to);
};

const withoutSequences = (raw: string): string => TERMINAL_SEQUENCES.reduce((text, pattern) => text.replace(pattern, ''), raw);

const cleanLine = (raw: string, max: number): string => {
  const text = [...withoutSequences(raw)].filter(shown).join('').trimEnd();
  return text.length > max ? `${text.slice(0, max)} [line cut]` : text;
};

export { cleanLine };
