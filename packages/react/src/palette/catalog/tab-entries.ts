/* @layer renderer-shell @kind logic */
import { nav } from '../../navigation/nav';
import { SETTINGS_BREADCRUMB, SETTINGS_SCREEN } from '../palette.constants';
import type { CatalogInput, SearchEntry } from '../palette.type';
import { visibleTabs } from './visible-tabs';

const tabEntries = (input: CatalogInput): SearchEntry[] =>
  visibleTabs(input).map((tab) => ({
    id: `tab:${tab.id}`,
    kind: 'tab',
    label: tab.label,
    icon: tab.navIcon,
    breadcrumb: [SETTINGS_BREADCRUMB],
    keywords: tab.group,
    run: () => nav.open(SETTINGS_SCREEN, { tab: tab.id }),
  }));

export { tabEntries };
