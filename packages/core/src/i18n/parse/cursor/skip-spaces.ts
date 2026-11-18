/* @layer core @kind logic */
import type { Cursor } from '../parse.type';
import { peek } from './peek';

const skipSpaces = (c: Cursor): void => {
  while (/\s/.test(peek(c))) c.pos += 1;
};

export { skipSpaces };
