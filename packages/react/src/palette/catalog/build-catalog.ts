/* @layer renderer-shell @kind logic */
import { uniqueById } from '../../collections/unique-by-id';
import type { CatalogInput, SearchEntry } from '../palette.type';
import { actionEntries } from './action-entries';
import { menuEntries } from './menu-entries';
import { screenAllowed } from './screen-allowed';
import { screenEntries } from './screen-entries';
import { settingEntries } from './setting-entries';
import { tabEntries } from './tab-entries';

const blockedScreens = (input: CatalogInput): Set<string> =>
  new Set(input.screens.filter((screen) => !screenAllowed(screen, input)).map((screen) => screen.id));

const buildCatalog = (input: CatalogInput): SearchEntry[] => uniqueById([
  ...menuEntries(input.menu, blockedScreens(input)),
  ...screenEntries(input),
  ...tabEntries(input),
  ...settingEntries(input),
  ...actionEntries(input.actions),
]);

export { buildCatalog };
