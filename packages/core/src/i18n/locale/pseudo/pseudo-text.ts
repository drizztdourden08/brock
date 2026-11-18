/* @layer core @kind logic */
import { ACCENTS, PSEUDO_GROWTH, PSEUDO_MIRRORED } from './pseudo.constants';

const accent = (text: string): string => text.replace(/[A-Za-z]/g, (ch) => ACCENTS[ch] ?? ch);

const grow = (text: string): string => text + '~'.repeat(Math.ceil(text.length * PSEUDO_GROWTH));

const mirror = (text: string): string => [...text].reverse().join('');

const pseudoText = (text: string, tag: string): string => {
  if (!/[A-Za-z]/.test(text)) return text;
  return tag === PSEUDO_MIRRORED ? mirror(grow(text)) : accent(grow(text));
};

export { pseudoText };
