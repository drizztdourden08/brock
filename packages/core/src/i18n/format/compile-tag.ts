/* @layer core @kind logic */
import type { TagNode } from '../parse/node.type';
import type { Compiled, NodesCompiler } from './env.type';
import { pick } from './pick-case';

const compileTag = (node: TagNode, compileNodes: NodesCompiler): Compiled => {
  const inner = compileNodes(node.children);
  return (env) => {
    const children = inner(env);
    const wrap = env.tags ? pick(env.tags, node.name) : undefined;
    return wrap ? [wrap(children)] : children;
  };
};

export { compileTag };
