/* @layer electron-main @kind logic */
import { TERMINAL_ESCAPE } from './process-job.constants';

const printable = (char: string): boolean => {
  const code = char.charCodeAt(0);
  return char === '\t' || (code >= 32 && code !== 127);
};

const withoutEscapes = (raw: string): string =>
  raw.split(TERMINAL_ESCAPE).map((part, index) => (index === 0 ? part : part.replace(/^\[[0-9;?]*[A-Za-z]/, ''))).join('');

const cleanLine = (raw: string, max: number): string => {
  const text = [...withoutEscapes(raw)].filter(printable).join('').trimEnd();
  return text.length > max ? `${text.slice(0, max)} [line cut]` : text;
};

export { cleanLine };
