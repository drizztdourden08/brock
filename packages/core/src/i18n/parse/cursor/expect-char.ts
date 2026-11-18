/* @layer core @kind logic */
import type { Cursor } from '../parse.type';
import { fail } from './fail';
import { peek } from './peek';

const expectChar = (c: Cursor, ch: string): void => {
  if (peek(c) !== ch) fail(c, `expected ${ch}`);
  c.pos += 1;
};

export { expectChar };
