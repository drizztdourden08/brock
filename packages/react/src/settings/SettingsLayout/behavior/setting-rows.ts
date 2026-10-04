/* @layer renderer-shell @kind logic */
import { createElement } from 'react';
import type { SettingsSectionRow } from '@drizztdourden08/tessera/composites';
import type { SettingItem } from '../../settings.type';
import type { SettingRowContext } from '../SettingsLayout.type';
import { SettingActions } from '../sub-components/SettingActions';
import { ACTIONS_ROW_SUFFIX } from '../SettingsLayout.constants';
import { settingRow } from './setting-row';

const drawsActions = (row: SettingsSectionRow): boolean => 'input' in row && row.input.kind === 'custom';

const settingRows = <S extends object>(item: SettingItem, ctx: SettingRowContext<S>): SettingsSectionRow[] => {
  const row = settingRow(item, ctx);
  if (!row) return [];
  const actions = item.actions ?? [];
  if (actions.length === 0 || drawsActions(row)) return [row];
  const actionRow: SettingsSectionRow = {
    id: `${item.key}${ACTIONS_ROW_SUFFIX}`,
    hint: item.hint,
    noDescription: true,
    lock: ctx.lock,
    content: createElement(SettingActions, { actions, disabled: ctx.disabled }),
  };
  return [row, actionRow];
};

export { settingRows };
