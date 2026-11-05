/* @layer renderer-shell @kind component */
import { GroupTree } from '@drizztdourden08/tessera/composites';
import { checkRowKey } from '../../behavior/check-row-key';
import type { CheckRow as CheckRowData } from '../../behavior/check-row.type';
import { NO_ROWS_MESSAGE } from '../../ChecksView.constants';
import { CheckCard } from '../CheckCard';
import { CheckRow } from '../CheckRow';
import type { ChecksGroupsProps } from './ChecksGroups.type';
import { withGroupCounts } from './with-group-counts';

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
