/* @layer core @kind logic */
import type { Cursor } from '../parse.type';
import { fail } from './fail';

const readName = (c: Cursor): string => {
  const match = /^[^\s,{}<>]+/.exec(c.src.slice(c.pos));
  if (!match) return fail(c, 'expected a name');
  c.pos += match[0].length;
  return match[0];
};

export { readName };
