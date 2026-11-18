/* @layer core @kind logic */
import type { Compiled } from './env.type';
import { pseudoNodes } from '../locale/pseudo/pseudo-nodes';
import { parseMessage } from '../parse/parse-message';
import { compileNodes } from './compile-nodes';

const compileMessage = (source: string, pseudo: string | null): Compiled => {
  try {
    const nodes = parseMessage(source);
    return compileNodes(pseudo ? pseudoNodes(nodes, pseudo) : nodes);
  } catch {
    return () => [source];
  }
};

export { compileMessage };
