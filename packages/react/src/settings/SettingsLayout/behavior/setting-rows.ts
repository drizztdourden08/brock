/* @layer renderer-shell @kind logic */
import type { SettingsSectionRow } from '@drizztdourden08/tessera/composites';
import type { SettingItem } from '../../settings.type';
import type { SettingRowContext } from '../SettingsLayout.type';
import { settingRow } from './setting-row';

const settingRows = <S extends object>(item: SettingItem, ctx: SettingRowContext<S>): SettingsSectionRow[] => {
  const row = settingRow(item, ctx);
  return row ? [row] : [];
};

export { settingRows };
