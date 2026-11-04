/* @layer renderer-shell @kind component */
import { GroupTree } from '@drizztdourden08/tessera/composites';
import { checkRowKey } from '../../behavior/check-row-key';
import type { CheckRow as CheckRowData } from '../../behavior/check-row.type';
import { NO_ROWS_MESSAGE } from '../../ChecksView.constants';
import { CheckRow } from '../CheckRow';
import type { ChecksGroupsProps } from './ChecksGroups.type';

const ChecksGroups = ({ root, expanded, onExpanded, onToggle }: ChecksGroupsProps) => (
  <GroupTree
    root={root}
    getItemKey={checkRowKey}
    renderItem={(row: CheckRowData) => <CheckRow row={row} onToggle={onToggle} />}
    expandedKeys={expanded}
    onExpandedChange={onExpanded}
    emptyLabel={NO_ROWS_MESSAGE}
  />
);

export { ChecksGroups };
