/* @layer renderer-shell @kind logic */
import { nav } from '../../navigation/nav';
import type { CatalogInput, SearchEntry } from '../palette.type';
import { screenAllowed } from './screen-allowed';

const screenEntries = (input: CatalogInput): SearchEntry[] =>
  input.screens
    .filter((screen) => screen.id !== input.home && screenAllowed(screen, input))
    .map((screen) => ({
      id: `screen:${screen.id}`,
      kind: 'screen',
      label: screen.title,
      icon: screen.icon,
      breadcrumb: [],
      keywords: screen.group,
      run: () => nav.open(screen.id),
    }));

export { screenEntries };
