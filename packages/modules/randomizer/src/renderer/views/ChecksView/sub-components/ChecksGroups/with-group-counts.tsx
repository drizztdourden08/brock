/* @layer renderer-shell @kind logic */
import type { TreeNode } from '@drizztdourden08/tessera/composites';
import { countRows } from '../../behavior/count-rows';
import type { CheckRow } from '../../behavior/check-row.type';
import { GroupCounts } from '../GroupCounts';

const rowsUnder = (node: TreeNode<CheckRow>): CheckRow[] => [...node.items, ...node.children.flatMap(rowsUnder)];

const withGroupCounts = (node: TreeNode<CheckRow>): TreeNode<CheckRow> => ({
  ...node,
  meta: node.children.length === 0 && node.items.length === 0 ? undefined : <GroupCounts counts={countRows(rowsUnder(node))} />,
  children: node.children.map(withGroupCounts),
});

export { withGroupCounts };
