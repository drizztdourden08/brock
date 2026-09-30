/* @layer renderer-shell @kind logic */
import { joinRoute } from '../../../navigation/join-route';
import { SCREEN_ID_PREFIX } from '../../../search/search.constants';
import type { SearchEntry } from '../../../search/search.type';
import type { HubDef, HubPage } from '../../hub.type';

const tabEntries = (hub: HubDef, page: HubPage): SearchEntry[] => (page.tabs ?? []).map((tab) => ({
  id: `${SCREEN_ID_PREFIX}${joinRoute(hub.id, page.id, tab.id)}`,
  kind: 'tab',
  label: tab.label,
  keywords: [],
  breadcrumb: [hub.title, page.label],
  target: { route: joinRoute(hub.id, page.id, tab.id) },
  icon: page.icon,
}));

const hubPageEntries = (hub: HubDef, pages: readonly HubPage[]): SearchEntry[] => pages.flatMap((page) => {
  const route = page === hub.home ? hub.id : joinRoute(hub.id, page.id);
  const own: SearchEntry = { id: `${SCREEN_ID_PREFIX}${route}`, kind: 'page', label: page.label, keywords: [], breadcrumb: [hub.title], target: { route }, icon: page.icon };
  return [own, ...tabEntries(hub, page)];
});

export { hubPageEntries };
