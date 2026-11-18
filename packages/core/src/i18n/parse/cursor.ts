/* @layer core @kind logic */
import type { Cursor } from './parse.type';

const createCursor = (src: string): Cursor => ({ src, pos: 0 });

const peek = (c: Cursor, offset = 0): string => c.src.charAt(c.pos + offset);

const atEnd = (c: Cursor): boolean => c.pos >= c.src.length;

const isOpenTag = (c: Cursor): boolean => peek(c) === '<' && /[A-Za-z]/.test(peek(c, 1));

const isCloseTag = (c: Cursor): boolean => peek(c) === '<' && peek(c, 1) === '/';

const skipSpaces = (c: Cursor): void => {
  while (/\s/.test(peek(c))) c.pos += 1;
};

const fail = (c: Cursor, message: string): never => {
  throw new Error(`${message} at ${c.pos} in "${c.src}"`);
};

const expectChar = (c: Cursor, ch: string): void => {
  if (peek(c) !== ch) fail(c, `expected ${ch}`);
  c.pos += 1;
};

const readName = (c: Cursor): string => {
  const match = /^[^\s,{}<>]+/.exec(c.src.slice(c.pos));
  if (!match) return fail(c, 'expected a name');
  c.pos += match[0].length;
  return match[0];
};

export { createCursor, peek, atEnd, isOpenTag, isCloseTag, skipSpaces, fail, expectChar, readName };
