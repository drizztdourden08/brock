/* @layer renderer-shell @kind logic */
import { msg } from '@drizztdourden08/brock-core/i18n';
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { SearchAction } from '../search/search.type';
import { tours } from './tours';
import { TOUR_ICON, TOUR_KEYWORDS, TOUR_SEARCH_GROUP } from './tours.constants';
import type { TourDef } from './tour.type';

const tourSearchActions = (list: readonly TourDef[], text: (value: Text) => string): SearchAction[] => list.map((tour) => ({
  id: `tour:${tour.id}`,
  label: text(msg('brock-app:tours.action', { title: text(tour.title) })),
  icon: TOUR_ICON,
  group: text(TOUR_SEARCH_GROUP),
  keywords: [...TOUR_KEYWORDS, text(tour.title)],
  ...(tour.description ? { description: text(tour.description) } : {}),
  run: () => { tours.start(tour.id); },
}));

export { tourSearchActions };
