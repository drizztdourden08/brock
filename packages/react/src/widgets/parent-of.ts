/* @layer renderer-shell @kind logic */
import type { LayoutNode, SplitNode } from '@drizztdourden08/tessera/composites';

const parentOf = (node: LayoutNode, key: string): SplitNode | null => {
  if (node.kind !== 'split') return null;
  if (node.children.some((child) => child.kind === 'pane' && child.key === key)) return node;
  for (const child of node.children) {
    const found = parentOf(child, key);
    if (found) return found;
  }
  return null;
};

export { parentOf };
