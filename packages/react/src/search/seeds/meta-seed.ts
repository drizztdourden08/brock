/* @layer renderer-shell @kind logic */
import type { ScreenMeta } from '../../screens/conventions/screens-config.type';
import { normaliseKeywords } from '../normalise-keywords';
import type { SearchFileSeed } from '../search.type';

type SeedMeta = Pick<ScreenMeta, 'title' | 'icon' | 'keywords' | 'devOnly'>;

const metaSeed = ({ title, icon, keywords, devOnly }: SeedMeta = {}): Pick<SearchFileSeed, 'title' | 'icon' | 'keywords' | 'devOnly'> => ({
  ...(title === undefined ? {} : { title }),
  ...(icon === undefined ? {} : { icon }),
  keywords: normaliseKeywords(keywords),
  ...(devOnly === true ? { devOnly } : {}),
});

export { metaSeed };
