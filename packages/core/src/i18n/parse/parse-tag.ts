/* @layer core @kind logic */
import type { TagNode } from './node.type';
import type { ParseCtx } from './parse.type';
import { expectChar, fail, readName } from './cursor';

const parseTag = (ctx: ParseCtx): TagNode => {
  const { c } = ctx;
  expectChar(c, '<');
  const name = readName(c);
  expectChar(c, '>');
  const children = ctx.body(ctx);
  expectChar(c, '<');
  expectChar(c, '/');
  const closing = readName(c);
  expectChar(c, '>');
  if (closing !== name) fail(c, `closing ${closing} does not match ${name}`);
  return { t: 'tag', name, children };
};

export { parseTag };
