/* @layer renderer-shell @kind logic */
import type { Section, SettingItem, TabDef } from '../../settings/settings.type';
import { normaliseKeywords } from '../normalise-keywords';
import { SETTING_ID_PREFIX } from '../search.constants';
import type { CatalogInput, SearchEntry } from '../search.type';
import { settingToggle } from './setting-toggle';
import { tabCrumbs } from './tab-crumbs';
import { tabTarget } from './tab-target';
import { visibleTabs } from './visible-tabs';

const groupsOf = (section: Section): { trail: string[]; items: SettingItem[] }[] =>
  section.subsections
    ? section.subsections.map((sub) => ({ trail: [section.title, sub.title], items: sub.items }))
    : [{ trail: [section.title], items: section.items ?? [] }];

const itemEntry = (tab: TabDef<object>, trail: readonly string[], item: SettingItem, input: CatalogInput): SearchEntry => ({
  id: `${SETTING_ID_PREFIX}${item.key}`,
  kind: 'setting',
  label: item.label,
  icon: tab.navIcon,
  breadcrumb: [...tabCrumbs(tab, input.settingsPlace), tab.label, ...trail],
  description: item.description,
  keywords: normaliseKeywords(item.keywords),
  toggle: settingToggle(item.key, input),
  target: tabTarget(tab, input.settingsPlace, item.key),
});

const tabSettings = (tab: TabDef<object>, input: CatalogInput, settings: object): SearchEntry[] =>
  (tab.sections?.(settings) ?? []).flatMap((section) =>
    groupsOf(section).flatMap((group) => group.items.map((item) => itemEntry(tab, group.trail, item, input))));

const settingEntries = (input: CatalogInput): SearchEntry[] => {
  const { settings } = input;
  if (settings === null) return [];
  return visibleTabs(input).flatMap((tab) => tabSettings(tab, input, settings));
};

export { settingEntries };
