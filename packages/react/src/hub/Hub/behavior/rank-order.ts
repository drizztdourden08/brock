/* @layer renderer-shell @kind logic */
import type { SearchEntry } from '../../../search/search.type';
import type { HubDef, HubPage } from '../../hub.type';
import { pageIdOf } from './page-id-of';

const rankOrder = (hub: HubDef, pages: readonly HubPage[], ranked: readonly SearchEntry[]) => {
  const firstHit = new Map<string, number>();
  ranked.forEach((entry, index) => {
    const id = pageIdOf(hub, entry);
    if (!firstHit.has(id)) firstHit.set(id, index);
  });
  return (id: string): number => firstHit.get(id) ?? ranked.length + pages.findIndex((page) => page.id === id);
};

export { rankOrder };
