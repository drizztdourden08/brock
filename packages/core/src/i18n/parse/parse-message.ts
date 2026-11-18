/* @layer core @kind logic */
import type { MessageNode } from './node.type';
import { atEnd, createCursor, fail } from './cursor';
import { parseNodes } from './parse-nodes';

const parseMessage = (source: string): readonly MessageNode[] => {
  const c = createCursor(source);
  const nodes = parseNodes({ c, pound: false, body: parseNodes });
  if (!atEnd(c)) fail(c, 'unexpected character');
  return nodes;
};

export { parseMessage };
