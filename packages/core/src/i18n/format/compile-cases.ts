/* @layer core @kind logic */
import type { NodeCases } from '../parse/node.type';
import type { Compiled, NodesCompiler } from './env.type';

const compileCases = (cases: NodeCases, compileNodes: NodesCompiler): Readonly<Record<string, Compiled>> =>
  Object.fromEntries(Object.entries(cases).map(([selector, nodes]) => [selector, compileNodes(nodes)]));

export { compileCases };
