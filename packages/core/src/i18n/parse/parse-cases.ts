/* @layer core @kind logic */
import type { MessageNode, NodeCases } from './node.type';
import type { ParseCtx } from './parse.type';
import { expectChar } from './cursor/expect-char';
import { fail } from './cursor/fail';
import { peek } from './cursor/peek';
import { readName } from './cursor/read-name';
import { skipSpaces } from './cursor/skip-spaces';

const parseCases = (ctx: ParseCtx, pound: boolean): NodeCases => {
  const { c } = ctx;
  const cases = Object.create(null) as Record<string, readonly MessageNode[]>;
  skipSpaces(c);
  while (peek(c) !== '}') {
    const selector = readName(c);
    skipSpaces(c);
    expectChar(c, '{');
    cases[selector] = ctx.body({ ...ctx, pound });
    expectChar(c, '}');
    skipSpaces(c);
  }
  c.pos += 1;
  if (!('other' in cases)) fail(c, 'missing other case');
  return cases;
};

export { parseCases };
