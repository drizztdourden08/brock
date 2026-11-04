/* @layer renderer-shell @kind types */
import type { TreeNode } from '@drizztdourden08/tessera/composites';
import type { CheckRow } from '../../behavior/check-row.type';

interface ChecksGroupsProps {
  root: TreeNode<CheckRow>;
  expanded: readonly string[];
  onExpanded(keys: readonly string[]): void;
  onToggle(key: string): void;
}

export type { ChecksGroupsProps };
