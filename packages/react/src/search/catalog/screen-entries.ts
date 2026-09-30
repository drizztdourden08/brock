/* @layer renderer-shell @kind logic */
import { normaliseKeywords } from '../normalise-keywords';
import { SCREEN_ID_PREFIX } from '../search.constants';
import type { CatalogInput, SearchEntry } from '../search.type';
import { screenAllowed } from './screen-allowed';

const screenEntries = (input: CatalogInput): SearchEntry[] =>
  input.screens
    .filter((screen) => screen.id !== input.home && screenAllowed(screen, input))
    .map((screen) => ({
      id: `${SCREEN_ID_PREFIX}${screen.id}`,
      kind: 'screen',
      label: screen.title,
      icon: screen.icon,
      breadcrumb: [],
      keywords: normaliseKeywords(screen.group),
      target: { route: screen.id },
    }));

export { screenEntries };
