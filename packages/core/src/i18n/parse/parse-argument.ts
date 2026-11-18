/* @layer core @kind logic */
import type { MessageNode } from './node.type';
import type { ParseCtx } from './parse.type';
import { expectChar } from './cursor/expect-char';
import { fail } from './cursor/fail';
import { peek } from './cursor/peek';
import { readName } from './cursor/read-name';
import { skipSpaces } from './cursor/skip-spaces';
import { PARSERS } from './parse-argument.constants';

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
