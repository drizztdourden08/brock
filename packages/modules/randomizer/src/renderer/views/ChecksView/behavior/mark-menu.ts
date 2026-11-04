/* @layer renderer-shell @kind logic */
import type { MenuGroup } from '@drizztdourden08/tessera/composites';
import { CLEAR_LABEL, MARK_ITEM_ID, MARK_LABEL, MENU_GROUP_ID } from '../ChecksView.constants';
import type { CheckRow } from './check-row.type';

const markMenu = (row: CheckRow, onToggle: (key: string) => void): MenuGroup[] => [{
  id: MENU_GROUP_ID,
  items: [{
    id: MARK_ITEM_ID,
    label: row.marked ? CLEAR_LABEL : MARK_LABEL,
    disabled: row.status === 'checked' && !row.marked,
    onSelect: () => onToggle(row.key),
  }],
}];

export { markMenu };
