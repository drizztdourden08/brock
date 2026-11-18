/* @layer core @kind logic */
import type { MessageNode } from './node.type';
import type { ParseCtx } from './parse.type';
import { isCloseTag, isOpenTag, peek } from './cursor';
import { parseArgument } from './parse-argument';
import { parseTag } from './parse-tag';
import { readText } from './read-text';

const readNode = (ctx: ParseCtx): MessageNode | null => {
  const { c } = ctx;
  const ch = peek(c);
  if (ch === '' || ch === '}' || isCloseTag(c)) return null;
  if (ch === '{') {
    c.pos += 1;
    return parseArgument(ctx);
  }
  if (isOpenTag(c)) return parseTag(ctx);
  if (ch === '#' && ctx.pound) {
    c.pos += 1;
    return { t: 'pound' };
  }
  return { t: 'text', value: readText(c, ctx.pound) };
};

const parseNodes = (ctx: ParseCtx): readonly MessageNode[] => {
  const nodes: MessageNode[] = [];
  for (let node = readNode(ctx); node; node = readNode(ctx)) nodes.push(node);
  return nodes;
};

export { parseNodes };
