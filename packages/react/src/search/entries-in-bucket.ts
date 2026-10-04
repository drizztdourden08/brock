/* @layer renderer-shell @kind logic */
import { ROUTE_SEPARATOR } from '../navigation/navigation.constants';
import type { SearchEntry } from './search.type';

const entriesInBucket = (entries: readonly SearchEntry[], bucket: string): SearchEntry[] =>
  entries.filter((entry) => entry.target !== undefined && (entry.target.params === undefined || entry.kind === 'entry') &&entry.target.route.split(ROUTE_SEPARATOR)[0] === bucket);

export { entriesInBucket };
