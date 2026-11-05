/* @layer renderer-shell @kind types */
import type { TreeNode } from '@drizztdourden08/tessera/composites';
import type { CheckRow } from '../../behavior/check-row.type';
import type { ViewMode } from '../../ChecksView.type';

interface ChecksGroupsProps {
  root: TreeNode<CheckRow>;
  viewMode: ViewMode;
  expanded: readonly string[];
  onExpanded(keys: readonly string[]): void;
  onToggle(key: string): void;
}

export type { ChecksGroupsProps };
