/* @layer core @kind logic */
import { KEY_CODE_GLYPHS } from './display.constants';

const keyCodeToGlyph = (code: string): string | null => {
  if (code.startsWith('Key')) return `kb-${code.slice(3).toLowerCase()}`;
  if (code.startsWith('Digit')) return `kb-${code.slice(5)}`;
  if (/^F\d+$/.test(code)) return `kb-${code.toLowerCase()}`;
  return KEY_CODE_GLYPHS[code] ?? null;
};

export { keyCodeToGlyph };
