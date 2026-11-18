/* @layer renderer-shell @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import { fallbackText } from '../../../i18n/fallback-text';
import { joinRoute } from '../../../navigation/join-route';
import { normaliseKeywords } from '../../../search/normalise-keywords';
import { SCREEN_ID_PREFIX } from '../../../search/search.constants';
import type { SearchEntry } from '../../../search/search.type';
import type { HubDef, HubPage } from '../../hub.type';

type TextOf = (value: Text) => string;

const tabEntries = (hub: HubDef, page: HubPage, text: TextOf): SearchEntry[] => (page.tabs ?? []).map((tab) => ({
  id: `${SCREEN_ID_PREFIX}${joinRoute(hub.id, page.id, tab.id)}`,
  kind: 'tab',
  label: text(tab.label),
  keywords: [],
  breadcrumb: [hub.title, text(page.label)],
  target: { route: joinRoute(hub.id, page.id, tab.id) },
  icon: page.icon,
}));

const hubPageEntries = (hub: HubDef, pages: readonly HubPage[], text: TextOf = fallbackText): SearchEntry[] => pages.flatMap((page) => {
  const route = page === hub.home ? hub.id : joinRoute(hub.id, page.id);
  const keywords = normaliseKeywords((page.keywords ?? []).map(text));
  const own: SearchEntry = { id: `${SCREEN_ID_PREFIX}${route}`, kind: 'page', label: text(page.label), keywords, breadcrumb: [hub.title], target: { route }, icon: page.icon };
  return [own, ...tabEntries(hub, page, text)];
});

export { hubPageEntries };
