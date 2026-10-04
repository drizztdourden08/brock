/* @layer renderer-shell @kind logic */
import type { Section, SettingItem } from '../../settings.type';
import type { ItemGroup, ResolvedSection } from '../SettingsLayout.type';

const groupsOf = (section: Section): ItemGroup[] =>
  section.subsections
    ? section.subsections.map((sub) => ({ id: sub.id, title: sub.title, items: sub.items }))
    : [{ id: null, title: null, items: section.items ?? [] }];

const choiceWords = (item: SettingItem): string[] =>
  (item.control?.kind === 'choice' ? item.control.options.flatMap((option) => [option.label, option.hint ?? '']) : []);

const matches = (item: SettingItem, query: string): boolean =>
  [item.label, item.description ?? '', item.hint, item.keywords ?? '', ...choiceWords(item)].some((text) => text.toLowerCase().includes(query));

const resolveSections = (sections: readonly Section[], query: string): ResolvedSection[] =>
  sections
    .map((section) => ({
      id: section.id,
      title: section.title,
      groups: groupsOf(section)
        .map((group) => ({ ...group, items: query ? group.items.filter((i) => matches(i, query)) : group.items }))
        .filter((group) => group.items.length > 0),
    }))
    .filter((section) => section.groups.length > 0);

export { resolveSections };
