/* @layer core @kind logic */
import type { MessageNode } from './node.type';
import { atEnd } from './cursor/at-end';
import { createCursor } from './cursor/create-cursor';
import { fail } from './cursor/fail';
import { parseNodes } from './parse-nodes';

const parseMessage = (source: string): readonly MessageNode[] => {
  const c = createCursor(source);
  const nodes = parseNodes({ c, pound: false, body: parseNodes });
  if (!atEnd(c)) fail(c, 'unexpected character');
  return nodes;
};

export { parseMessage };
