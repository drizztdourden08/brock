/* @layer renderer-shell @kind component */
import { GroupTree } from '@drizztdourden08/tessera/composites';
import type { TreeNode } from '@drizztdourden08/tessera/composites';
import { checkRowKey } from '../../behavior/check-row-key';
import { countRows } from '../../behavior/count-rows';
import type { CheckRow as CheckRowData } from '../../behavior/check-row.type';
import { NO_ROWS_MESSAGE } from '../../ChecksView.constants';
import { CheckCard } from '../CheckCard';
import { CheckRow } from '../CheckRow';
import { GroupCounts } from '../GroupCounts';
import type { ChecksGroupsProps } from './ChecksGroups.type';

const rowsUnder = (node: TreeNode<CheckRowData>): CheckRowData[] => [...node.items, ...node.children.flatMap(rowsUnder)];

const withGroupCounts = (node: TreeNode<CheckRowData>): TreeNode<CheckRowData> => ({
  ...node,
  meta: node.children.length === 0 && node.items.length === 0 ? undefined : <GroupCounts counts={countRows(rowsUnder(node))} />,
  children: node.children.map(withGroupCounts),
});

const ChecksGroups = ({ root, viewMode, expanded, onExpanded, onToggle }: ChecksGroupsProps) => (
  <GroupTree
    root={withGroupCounts(root)}
    getItemKey={checkRowKey}
    renderItem={(row: CheckRowData) =>
      viewMode === 'visual' ? <CheckCard row={row} onToggle={onToggle} /> : <CheckRow row={row} detailed={viewMode === 'detailed'} onToggle={onToggle} />}
    expandedKeys={expanded}
    onExpandedChange={onExpanded}
    emptyLabel={NO_ROWS_MESSAGE}
  />
);

export { ChecksGroups };
