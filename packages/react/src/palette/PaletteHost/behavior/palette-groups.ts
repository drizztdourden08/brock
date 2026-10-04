/* @layer renderer-shell @kind logic */
import type { CommandPaletteGroup } from '@drizztdourden08/tessera/composites';
import { ROUTE_SEPARATOR } from '../../../navigation/navigation.constants';
import { rankInScope } from '../../../search/rank-in-scope';
import type { PaletteScope, SearchEntry } from '../../../search/search.type';
import { IDLE_SCREEN_LIMIT } from '../../palette.constants';
import type { PaletteItem } from '../PaletteHost.type';
import { toPaletteItem } from './to-palette-item';

const group = (id: string, label: string | undefined, entries: readonly SearchEntry[]): CommandPaletteGroup<PaletteItem>[] =>
  (entries.length === 0 ? [] : [{ id, label, items: entries.map(toPaletteItem) }]);

const hubPages = (catalog: readonly SearchEntry[], scope: PaletteScope): SearchEntry[] =>
  catalog.filter((entry) => entry.kind === 'page' && entry.target?.route.split(ROUTE_SEPARATOR)[0] === scope.bucket);

const idleGroups = (catalog: readonly SearchEntry[], scope: PaletteScope | null): CommandPaletteGroup<PaletteItem>[] => {
  const screens = catalog.filter((entry) => entry.kind === 'screen').slice(0, IDLE_SCREEN_LIMIT);
  const pages = scope === null ? [] : hubPages(catalog, scope);
  return [...group('hub', scope?.title, pages), ...group('screens', 'Screens', screens)];
};

const paletteGroups = (catalog: readonly SearchEntry[], query: string, scope: PaletteScope | null = null): CommandPaletteGroup<PaletteItem>[] => {
  if (query.trim().length === 0) return idleGroups(catalog, scope);
  const { inScope, rest } = rankInScope(catalog, query, scope?.bucket ?? null);
  if (scope === null) return [{ id: 'results', items: rest.map(toPaletteItem) }];
  return [...group('hub', `In ${scope.title}`, inScope), ...group('results', 'Everywhere else', rest)];
};

export { paletteGroups };
