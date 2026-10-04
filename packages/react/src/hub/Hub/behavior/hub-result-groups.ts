/* @layer renderer-shell @kind logic */
import type { SearchResultsGroup, SearchResultsHit } from '@drizztdourden08/tessera/composites';
import type { SearchEntry } from '../../../search/search.type';
import type { HubDef, HubPage } from '../../hub.type';
import { pageIdOf } from './page-id-of';

const hitOf = (page: HubPage, entry: SearchEntry): SearchResultsHit => {
  const at = entry.breadcrumb.indexOf(page.label);
  const tail = at === -1 ? [] : entry.breadcrumb.slice(at + 1);
  return { id: entry.id, label: entry.label, path: tail, description: entry.description };
};

const hubResultGroups = (hub: HubDef, pages: readonly HubPage[], ranked: readonly SearchEntry[]): SearchResultsGroup[] => {
  const byPage = new Map<string, SearchEntry[]>();
  for (const entry of ranked) {
    const id = pageIdOf(hub, entry);
    byPage.set(id, [...(byPage.get(id) ?? []), entry]);
  }
  return [...byPage.entries()].flatMap(([id, entries]) => {
    const page = pages.find((candidate) => candidate.id === id);
    if (page === undefined) return [];
    return [{ id, label: page.label, icon: page.icon, count: entries.length, hits: entries.map((entry) => hitOf(page, entry)) }];
  });
};

export { hubResultGroups };
