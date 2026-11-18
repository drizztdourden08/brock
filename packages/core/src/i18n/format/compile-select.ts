/* @layer core @kind logic */
import type { SelectNode } from '../parse/node.type';
import type { Compiled, NodesCompiler } from './env.type';
import { EMPTY } from './compile-select.constants';
import { compileCases } from './compile-cases';
import { pick } from './pick-case';
import { toText } from './to-text';

const compileSelect = (node: SelectNode, compileNodes: NodesCompiler): Compiled => {
  const cases = compileCases(node.cases, compileNodes);
  return (env) => {
    const body = pick(cases, toText(env.values[node.name])) ?? pick(cases, 'other') ?? EMPTY;
    return body(env);
  };
};

export { compileSelect };
