/* @layer renderer-shell @kind logic */
import type { SettingItem, SettingLockCause } from '../../settings.type';
import type { ItemRun } from '../SettingsLayout.type';

const partitionByLock = (items: readonly SettingItem[], lockOf: (key: string) => SettingLockCause | null): ItemRun[] => {
  const runs: ItemRun[] = [];
  for (const item of items) {
    const lock = lockOf(item.key);
    const current = runs.at(-1);
    if (current?.lock === lock) current.items.push(item);
    else runs.push({ lock, items: [item] });
  }
  return runs;
};

export { partitionByLock };
