/* @layer core @kind logic */
import type { MessageNode } from '../parse/node.type';
import type { Compiled } from './env.type';
import { compileNode } from './compile-node';

const compileNodes = (nodes: readonly MessageNode[]): Compiled => {
  const parts = nodes.map((node) => compileNode(node, compileNodes));
  return (env) => parts.flatMap((part) => part(env));
};

export { compileNodes };
