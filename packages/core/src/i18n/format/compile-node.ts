/* @layer core @kind logic */
import type { MessageNode } from '../parse/node.type';
import type { Compiled, NodesCompiler } from './env.type';
import { compileFormat } from './compile-format';
import { compilePlural } from './compile-plural';
import { compileSelect } from './compile-select';
import { compileArg, compilePound, compileText } from './compile-simple';
import { compileTag } from './compile-tag';

const compileNode = (node: MessageNode, compileNodes: NodesCompiler): Compiled => {
  switch (node.t) {
    case 'text': return compileText(node.value);
    case 'pound': return compilePound;
    case 'arg': return compileArg(node.name);
    case 'format': return compileFormat(node);
    case 'plural': return compilePlural(node, compileNodes);
    case 'select': return compileSelect(node, compileNodes);
    case 'tag': return compileTag(node, compileNodes);
  }
};

export { compileNode };
