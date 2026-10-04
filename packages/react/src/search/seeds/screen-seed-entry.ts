/* @layer renderer-shell @kind logic */
import { entryLabel } from '../../screens/conventions/entry-label';
import { KIND_ICONS } from '../../screens/conventions/screens.constants';
import { SCREEN_ID_PREFIX } from '../search.constants';
import type { SearchEntry, SearchFileSeed } from '../search.type';

const screenSeedEntry = (seed: SearchFileSeed, kind: 'card' | 'layer' | 'base'): SearchEntry => ({
  id: `${SCREEN_ID_PREFIX}${seed.id}`,
  kind: 'screen',
  label: entryLabel({ id: seed.id, meta: { title: seed.title } }),
  keywords: seed.keywords ?? [],
  breadcrumb: [],
  target: { route: seed.id },
  icon: seed.icon ?? KIND_ICONS[kind],
  devOnly: seed.devOnly,
});

export { screenSeedEntry };
