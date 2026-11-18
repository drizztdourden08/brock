/* @layer renderer-shell @kind logic */
import { fallbackText } from '../../i18n/fallback-text';
import { normaliseKeywords } from '../normalise-keywords';
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { SearchFileSeed } from '../search.type';
import type { SeedMeta } from './meta-seed.type';
import { rowSeeds } from './row-seeds';

const metaSeed = ({ title, icon, keywords, searchRows, devOnly }: SeedMeta = {}, text: (value: Text) => string = fallbackText): Pick<SearchFileSeed, 'title' | 'icon' | 'keywords' | 'entries' | 'devOnly'> => ({
  ...(title === undefined ? {} : { title: text(title) }),
  ...(icon === undefined ? {} : { icon }),
  keywords: normaliseKeywords(keywords),
  ...(searchRows === undefined || searchRows.length === 0 ? {} : { entries: rowSeeds(searchRows) }),
  ...(devOnly === true ? { devOnly } : {}),
});

export { metaSeed };
