/* @layer core @kind logic */
import type { Cursor } from './parse.type';
import { expectChar } from './cursor/expect-char';
import { peek } from './cursor/peek';
import { readName } from './cursor/read-name';
import { skipSpaces } from './cursor/skip-spaces';

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
