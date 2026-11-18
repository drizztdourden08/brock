/* @layer core @kind logic */
import type { MessageNode } from '../../parse/node.type';
import { PSEUDO_MIRRORED, RTL_CLOSE, RTL_OPEN } from './pseudo.constants';
import { pseudoText } from './pseudo-text';

const mapNode = (node: MessageNode, tag: string): MessageNode => {
  const next = (nodes: readonly MessageNode[]): readonly MessageNode[] => nodes.map((child) => mapNode(child, tag));
  if (node.t === 'text') return { t: 'text', value: pseudoText(node.value, tag) };
  if (node.t === 'tag') return { ...node, children: next(node.children) };
  if (node.t === 'plural' || node.t === 'select') {
    return { ...node, cases: Object.fromEntries(Object.entries(node.cases).map(([selector, nodes]) => [selector, next(nodes)])) };
  }
  return node;
};

const pseudoNodes = (nodes: readonly MessageNode[], tag: string): readonly MessageNode[] => {
  const mirrored = tag === PSEUDO_MIRRORED;
  return [
    { t: 'text', value: mirrored ? `${RTL_OPEN}[` : '[' },
    ...nodes.map((node) => mapNode(node, tag)),
    { t: 'text', value: mirrored ? `]${RTL_CLOSE}` : ']' },
  ];
};

export { pseudoNodes };
