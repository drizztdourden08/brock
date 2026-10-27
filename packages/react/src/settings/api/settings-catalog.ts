/* @layer renderer-shell @kind logic */
import { controlSources } from '../../app/control-sources';
import { getPlatform } from '../../platform/get-platform';
import { settingsPlaceOf } from '../../search/catalog/settings-place-of';
import { tabTarget } from '../../search/catalog/tab-target';
import { readPath } from '../../volume/read-path';
import { sourceValues } from '../source-values';
import type { Section, SettingValues, TabDef } from '../settings.type';
import { tabSections } from '../tab-sections';
import { catalogItem } from './catalog-item';
import type { CatalogScreen, CatalogSection } from './settings-catalog.type';

const sectionOf = (section: Section, settings: object): CatalogSection => {
  const custom = section.source !== undefined;
  const shown = sourceValues(section) ?? (settings as SettingValues);
  const read = (key: string): unknown => (section.source ? section.source.get(key) : readPath(settings, key));
  const itemsOf = (items: Section['items']) => (items ?? []).map((item) => catalogItem(item, shown, read, custom));
  return {
    id: section.id,
    title: section.title,
    items: itemsOf(section.items),
    subsections: (section.subsections ?? []).map((sub) => ({ id: sub.id, title: sub.title, items: itemsOf(sub.items) })),
  };
};

const screenOf = (tab: TabDef<object>, settings: object): CatalogScreen => {
  const { tree } = controlSources.get();
  const target = tabTarget(tab, settingsPlaceOf(tree));
  return {
    id: tab.id,
    label: tab.label,
    group: tab.group,
    route: target.route,
    ...(target.params === undefined ? {} : { params: target.params }),
    sections: tabSections(tab, settings).map((section) => sectionOf(section, settings)),
  };
};

const settingsCatalog = (): CatalogScreen[] => {
  const { tabs, settings: store } = controlSources.get();
  if (store === null) return [];
  const current = store.getState().settings;
  const mobile = getPlatform().info.formFactor === 'mobile';
  return tabs.filter((tab) => tab.mobileOnly !== true || mobile).map((tab) => screenOf(tab, current));
};

export { settingsCatalog };
