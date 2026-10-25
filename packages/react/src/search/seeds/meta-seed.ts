/* @layer renderer-shell @kind logic */
import { normaliseKeywords } from '../normalise-keywords';
import type { SearchFileSeed } from '../search.type';
import type { SeedMeta } from './meta-seed.type';

const metaSeed = ({ title, icon, keywords, devOnly }: SeedMeta = {}): Pick<SearchFileSeed, 'title' | 'icon' | 'keywords' | 'devOnly'> => ({
  ...(title === undefined ? {} : { title }),
  ...(icon === undefined ? {} : { icon }),
  keywords: normaliseKeywords(keywords),
  ...(devOnly === true ? { devOnly } : {}),
});

export { metaSeed };
