/* @layer renderer-shell @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { SideNavItem } from '@drizztdourden08/tessera/composites';
import { fallbackText } from '../../../i18n/fallback-text';
import { ROUTE_SEPARATOR } from '../../../navigation/navigation.constants';
import type { SearchEntry } from '../../../search/search.type';
import type { HubDef, HubPage } from '../../hub.type';
import { pageIdOf } from './page-id-of';

const isPageEntry = (hub: HubDef, entry: SearchEntry): boolean =>
  entry.kind === 'page' && ((entry.target?.route.split(ROUTE_SEPARATOR).length ?? 0) <= 2 || pageIdOf(hub, entry).includes(ROUTE_SEPARATOR));

const rankedJumps = (hub: HubDef, pages: readonly HubPage[], ranked: readonly SearchEntry[], text: (value: Text) => string = fallbackText): SideNavItem[] => {
  const ids = [...new Set(ranked.filter((entry) => isPageEntry(hub, entry)).map((entry) => pageIdOf(hub, entry)))];
  return ids.flatMap((id) => {
    const page = pages.find((candidate) => candidate.id === id);
    return page ? [{ id: page.id, label: text(page.label), icon: page.icon }] : [];
  });
};

export { rankedJumps };
