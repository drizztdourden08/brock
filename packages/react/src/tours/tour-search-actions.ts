/* @layer renderer-shell @kind logic */
import type { SearchAction } from '../search/search.type';
import { tours } from './tours';
import { TOUR_ICON, TOUR_KEYWORDS, TOUR_SEARCH_GROUP } from './tours.constants';
import type { TourDef } from './tour.type';

const tourSearchActions = (list: readonly TourDef[]): SearchAction[] => list.map((tour) => ({
  id: `tour:${tour.id}`,
  label: `Take the tour: ${tour.title}`,
  icon: TOUR_ICON,
  group: TOUR_SEARCH_GROUP,
  keywords: [...TOUR_KEYWORDS, tour.title],
  ...(tour.description ? { description: tour.description } : {}),
  run: () => { tours.start(tour.id); },
}));

export { tourSearchActions };
