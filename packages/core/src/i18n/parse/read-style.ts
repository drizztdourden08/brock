/* @layer core @kind logic */
import type { Cursor } from './parse.type';
import { expectChar, peek, readName, skipSpaces } from './cursor';

const readStyle = (c: Cursor): string | undefined => {
  skipSpaces(c);
  if (peek(c) === '}') {
    c.pos += 1;
    return undefined;
  }
  expectChar(c, ',');
  skipSpaces(c);
  const style = readName(c);
  skipSpaces(c);
  expectChar(c, '}');
  return style;
};

export { readStyle };
