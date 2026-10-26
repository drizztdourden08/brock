/* @layer renderer-shell @kind logic */
import { normaliseKeywords } from '../normalise-keywords';
import type { SearchFileSeed } from '../search.type';
import type { SeedMeta } from './meta-seed.type';
import { rowSeeds } from './row-seeds';

const metaSeed = ({ title, icon, keywords, searchRows, devOnly }: SeedMeta = {}): Pick<SearchFileSeed, 'title' | 'icon' | 'keywords' | 'entries' | 'devOnly'> => ({
  ...(title === undefined ? {} : { title }),
  ...(icon === undefined ? {} : { icon }),
  keywords: normaliseKeywords(keywords),
  ...(searchRows === undefined || searchRows.length === 0 ? {} : { entries: rowSeeds(searchRows) }),
  ...(devOnly === true ? { devOnly } : {}),
});

export { metaSeed };
