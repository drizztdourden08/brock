/* @layer renderer-shell @kind logic */
import type { SideNavItem } from '@drizztdourden08/tessera/composites';
import { ROUTE_SEPARATOR } from '../../../navigation/navigation.constants';
import type { SearchEntry } from '../../../search/search.type';
import type { HubDef, HubPage } from '../../hub.type';
import { pageIdOf } from './page-id-of';

const isPageEntry = (entry: SearchEntry): boolean => entry.kind === 'page' && (entry.target?.route.split(ROUTE_SEPARATOR).length ?? 0) <= 2;

const rankedJumps = (hub: HubDef, pages: readonly HubPage[], ranked: readonly SearchEntry[]): SideNavItem[] => {
  const ids = [...new Set(ranked.filter(isPageEntry).map((entry) => pageIdOf(hub, entry)))];
  return ids.flatMap((id) => {
    const page = pages.find((candidate) => candidate.id === id);
    return page ? [{ id: page.id, label: page.label, icon: page.icon }] : [];
  });
};

export { rankedJumps };
