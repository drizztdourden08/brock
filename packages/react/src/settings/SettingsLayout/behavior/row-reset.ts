/* @layer renderer-shell @kind logic */
import type { SettingItem } from '../../settings.type';
import type { SettingRowContext, SettingsRecord, SettingsRowReset } from '../SettingsLayout.type';
import { changedKeys } from './changed-keys';
import { defaultsPatch } from './defaults-patch';
import { readPath } from './read-path';

const rowReset = <S extends object>(item: SettingItem, ctx: SettingRowContext<S>): SettingsRowReset | null => {
  const { settings, defaults, onChange, lock } = ctx;
  if (!defaults || lock !== null) return null;
  if (!readPath(defaults as SettingsRecord, item.key.split('.')).known) return null;
  const changed = changedKeys([{ id: null, title: null, items: [item] }], settings, defaults, () => false).length > 0;
  return { changed, onReset: () => onChange(defaultsPatch([item.key], settings, defaults)) };
};

export { rowReset };
