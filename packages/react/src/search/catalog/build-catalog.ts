/* @layer renderer-shell @kind logic */
import { uniqueById } from '../../collections/unique-by-id';
import type { CatalogInput, SearchEntry } from '../search.type';
import { uniqueByTarget } from '../unique-by-target';
import { actionEntries } from './action-entries';
import { indexEntries } from './index-entries';
import { liveEntries } from './live-entries';
import { menuEntries } from './menu-entries';
import { screenAllowed } from './screen-allowed';
import { screenEntries } from './screen-entries';
import { settingEntries } from './setting-entries';
import { tabEntries } from './tab-entries';

const blockedScreens = (input: CatalogInput): Set<string> =>
  new Set(input.screens.filter((screen) => !screenAllowed(screen, input)).map((screen) => screen.id));

const buildCatalog = (input: CatalogInput): SearchEntry[] => {
  const blocked = blockedScreens(input);
  return uniqueByTarget(uniqueById([
    ...indexEntries(input, blocked),
    ...menuEntries(input.menu, blocked),
    ...screenEntries(input),
    ...tabEntries(input),
    ...settingEntries(input),
    ...menuEntries(input.widgets, blocked),
    ...actionEntries(input.actions),
    ...liveEntries(input.live, input.index),
  ]));
};

export { buildCatalog };
