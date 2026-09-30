/* @layer renderer-shell @kind logic */
import type { CommandPaletteGroup } from '@drizztdourden08/tessera/composites';
import { IDLE_SCREEN_LIMIT } from '../../palette.constants';
import type { SearchEntry } from '../../../search/search.type';
import { rankEntries } from '../../../search/rank-entries';
import type { PaletteItem } from '../PaletteHost.type';
import { toPaletteItem } from './to-palette-item';

const paletteGroups = (catalog: readonly SearchEntry[], query: string): CommandPaletteGroup<PaletteItem>[] => {
  if (query.trim().length === 0) {
    const screens = catalog.filter((entry) => entry.kind === 'screen').slice(0, IDLE_SCREEN_LIMIT);
    return [{ id: 'screens', label: 'Screens', items: screens.map(toPaletteItem) }];
  }
  return [{ id: 'results', items: rankEntries(catalog, query).map(toPaletteItem) }];
};

export { paletteGroups };
