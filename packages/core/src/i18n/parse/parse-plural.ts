/* @layer core @kind logic */
import type { ArgumentParser, Cursor } from './parse.type';
import { expectChar, skipSpaces } from './cursor';
import { parseCases } from './parse-cases';

const readOffset = (c: Cursor): number => {
  skipSpaces(c);
  const match = /^offset:\s*(\d+)/.exec(c.src.slice(c.pos));
  if (!match) return 0;
  c.pos += match[0].length;
  return Number(match[1]);
};

const parsePluralOf = (ordinal: boolean): ArgumentParser => (ctx, name) => {
  expectChar(ctx.c, ',');
  const offset = readOffset(ctx.c);
  return { t: 'plural', name, ordinal, offset, cases: parseCases(ctx, true) };
};

const parsePlural = parsePluralOf(false);

export { parsePlural, parsePluralOf };
