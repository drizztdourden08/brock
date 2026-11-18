/* @layer renderer-shell @kind logic */
import { fallbackText } from '../../i18n/fallback-text';
import { normaliseKeywords } from '../normalise-keywords';
import type { CatalogInput, SearchEntry } from '../search.type';
import { tabCrumbs } from './tab-crumbs';
import { tabTarget } from './tab-target';
import { visibleTabs } from './visible-tabs';

const tabEntries = (input: CatalogInput): SearchEntry[] =>
  visibleTabs(input).map((tab) => ({
    id: `tab:${tab.id}`,
    kind: 'page',
    label: (input.text ?? fallbackText)(tab.label),
    icon: tab.navIcon,
    breadcrumb: tabCrumbs(tab, input.settingsPlace),
    keywords: normaliseKeywords(tab.group),
    target: tabTarget(tab, input.settingsPlace),
  }));

export { tabEntries };
