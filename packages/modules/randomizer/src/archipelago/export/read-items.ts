/* @layer core @kind logic */
import { walkRuleNode } from '../../world';
import type { RuleNode } from '../../world';

const readItemsOf = (
  trees: Iterable<RuleNode>, primitiveItems: (helper: string) => readonly string[],
): Set<string> => {
  const read = new Set<string>();
  const add = (items: readonly string[]): void => {
    for (const item of items) read.add(item);
  };
  for (const tree of trees) {
    walkRuleNode(tree, (node) => {
      if (node.op === 'has') add([String(node.item)]);
      if (node.op === 'hasAny' || node.op === 'hasDistinct' || node.op === 'countGroup') add(node.items);
      if (node.op === 'helper') add(primitiveItems(node.name));
    });
  }
  return read;
};

export { readItemsOf };
