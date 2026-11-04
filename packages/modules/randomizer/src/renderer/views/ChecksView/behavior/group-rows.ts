/* @layer renderer-shell @kind logic */
import type { TreeNode } from '@drizztdourden08/tessera/composites';
import { TREE_ROOT_KEY } from '../ChecksView.constants';
import type { CheckRow } from './check-row.type';

const groupRows = (rows: readonly CheckRow[]): TreeNode<CheckRow> => {
  const groups = new Map<string, { order: number; items: CheckRow[] }>();
  for (const row of rows) {
    const group = groups.get(row.group) ?? { order: row.order, items: [] };
    group.items.push(row);
    groups.set(row.group, group);
  }
  const children = [...groups.entries()]
    .sort(([, left], [, right]) => left.order - right.order)
    .map(([label, group]): TreeNode<CheckRow> => ({ key: label, label, children: [], items: group.items }));
  return { key: TREE_ROOT_KEY, label: TREE_ROOT_KEY, children, items: [] };
};

export { groupRows };
