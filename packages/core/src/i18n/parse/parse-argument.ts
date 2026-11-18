/* @layer core @kind logic */
import type { MessageNode } from './node.type';
import type { ArgumentParser, ParseCtx } from './parse.type';
import { expectChar, fail, peek, readName, skipSpaces } from './cursor';
import { parseDate } from './parse-date';
import { parseList } from './parse-list';
import { parseNumber } from './parse-number';
import { parsePlural } from './parse-plural';
import { parseSelect } from './parse-select';
import { parseSelectOrdinal } from './parse-selectordinal';
import { parseTime } from './parse-time';

const PARSERS: Readonly<Record<string, ArgumentParser>> = {
  number: parseNumber,
  date: parseDate,
  time: parseTime,
  list: parseList,
  plural: parsePlural,
  selectordinal: parseSelectOrdinal,
  select: parseSelect,
};

const parseArgument = (ctx: ParseCtx): MessageNode => {
  const { c } = ctx;
  skipSpaces(c);
  const name = readName(c);
  skipSpaces(c);
  if (peek(c) === '}') {
    c.pos += 1;
    return { t: 'arg', name };
  }
  expectChar(c, ',');
  skipSpaces(c);
  const type = readName(c);
  skipSpaces(c);
  const parser = Object.hasOwn(PARSERS, type) ? PARSERS[type] : undefined;
  return parser ? parser(ctx, name, type) : fail(c, `unknown argument type ${type}`);
};

export { parseArgument };
