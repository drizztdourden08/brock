/* @layer renderer-shell @kind logic */
import type { BucketEntry } from '../../screens/conventions/screen-tree.type';
import type { SearchFileSeed } from '../search.type';

const entryPlace = (entry: BucketEntry): Pick<SearchFileSeed, 'group' | 'page'> => ({
  ...('group' in entry && entry.group !== undefined ? { group: entry.group } : {}),
  ...('page' in entry ? { page: entry.page } : {}),
});

export { entryPlace };
