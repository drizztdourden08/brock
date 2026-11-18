/* @layer core @kind logic */
import type { FormatNode } from '../parse/node.type';
import type { Compiled } from './env.type';
import { formatArgument } from './format-argument';

const compileFormat = (node: FormatNode): Compiled => (env) => [formatArgument(node.kind, env.values[node.name], env.locale, node.style)];

export { compileFormat };
