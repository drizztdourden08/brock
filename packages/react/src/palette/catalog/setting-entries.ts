/* @layer renderer-shell @kind logic */
import { nav } from '../../navigation/nav';
import type { Section, SettingItem, TabDef } from '../../settings/settings.type';
import { SETTINGS_BREADCRUMB, SETTINGS_SCREEN } from '../palette.constants';
import type { CatalogInput, SearchEntry } from '../palette.type';
import { scrollToAnchor } from '../scroll-to-anchor';
import { settingToggle } from './setting-toggle';
import { visibleTabs } from './visible-tabs';

const groupsOf = (section: Section): { trail: string[]; items: SettingItem[] }[] =>
  section.subsections
    ? section.subsections.map((sub) => ({ trail: [section.title, sub.title], items: sub.items }))
    : [{ trail: [section.title], items: section.items ?? [] }];

const itemEntry = (tab: TabDef<object>, trail: readonly string[], item: SettingItem, input: CatalogInput): SearchEntry => ({
  id: `setting:${item.key}`,
  kind: 'setting',
  label: item.label,
  icon: tab.navIcon,
  breadcrumb: [SETTINGS_BREADCRUMB, tab.label, ...trail],
  description: item.description,
  keywords: item.keywords,
  toggle: settingToggle(item.key, input),
  run: () => {
    nav.open(SETTINGS_SCREEN, { tab: tab.id, anchor: item.key });
    scrollToAnchor(item.key);
  },
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
