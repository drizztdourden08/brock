/* @layer renderer-shell @kind logic */
import type { SettingsSectionData } from '@drizztdourden08/tessera/composites';
import type { GroupListInput } from '../SettingsLayout.type';
import { changedKeys } from './changed-keys';
import { defaultsPatch } from './defaults-patch';

const groupListSections = <S extends object>(input: GroupListInput<S>): SettingsSectionData[] => {
  const { sections, settings, defaults, onChange, lockOf, rowsOf } = input;
  const isLocked = (key: string): boolean => lockOf(key) !== null;

  return sections.map((section) => {
    const groups = section.groups.map((group) => ({
      id: group.id ?? undefined,
      title: group.title ?? undefined,
      rows: group.items.flatMap(rowsOf),
    }));
    if (!defaults) return { id: section.id, title: section.title, groups };
    const resettable = changedKeys(section.groups, settings, defaults, isLocked);
    return {
      id: section.id,
      title: section.title,
      groups,
      changedCount: resettable.length,
      onReset: () => onChange(defaultsPatch(resettable, settings, defaults)),
    };
  });
};

export { groupListSections };
