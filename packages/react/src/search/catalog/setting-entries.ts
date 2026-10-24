/* @layer renderer-shell @kind logic */
import type { Section, SettingItem, SettingValues, TabDef } from '../../settings/settings.type';
import { sourceValues } from '../../settings/source-values';
import { tabSections } from '../../settings/tab-sections';
import { normaliseKeywords } from '../normalise-keywords';
import { SETTING_ID_PREFIX } from '../search.constants';
import type { CatalogInput, SearchEntry } from '../search.type';
import type { EntryGroup } from './setting-entries.type';
import { settingToggle } from './setting-toggle';
import { sourceToggle } from './source-toggle';
import { tabCrumbs } from './tab-crumbs';
import { tabTarget } from './tab-target';
import { visibleTabs } from './visible-tabs';

const groupsOf = (section: Section): EntryGroup[] => {
  const { source } = section;
  return section.subsections
    ? section.subsections.map((sub) => ({ trail: [section.title, sub.title], items: sub.items, source }))
    : [{ trail: [section.title], items: section.items ?? [], source }];
};

const itemEntry = (tab: TabDef<object>, group: EntryGroup, item: SettingItem, input: CatalogInput): SearchEntry => ({
  id: `${SETTING_ID_PREFIX}${item.key}`,
  kind: 'setting',
  label: item.label,
  icon: tab.navIcon,
  breadcrumb: [...tabCrumbs(tab, input.settingsPlace), tab.label, ...group.trail],
  description: item.description,
  hint: item.hint,
  keywords: normaliseKeywords(item.keywords),
  toggle: group.source ? sourceToggle(item.key, group.source) : settingToggle(item.key, input),
  target: tabTarget(tab, input.settingsPlace, item.key),
});

const tabSettings = (tab: TabDef<object>, input: CatalogInput, settings: object): SearchEntry[] =>
  tabSections(tab, settings).flatMap((section) => {
    const shown = sourceValues(section) ?? (settings as SettingValues);
    return groupsOf(section).flatMap((group) => group.items
      .filter((item) => item.visible === undefined || item.visible(shown))
      .map((item) => itemEntry(tab, group, item, input)));
  });

const settingEntries = (input: CatalogInput): SearchEntry[] => {
  const { settings } = input;
  if (settings === null) return [];
  return visibleTabs(input).flatMap((tab) => tabSettings(tab, input, settings));
};

export { settingEntries };
