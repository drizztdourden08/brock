/* @layer renderer-shell @kind logic */
import type { MenuItem } from '../menu/menu.type';
import { TOUR_ICON, TOUR_MENU_KEY, TOUR_MENU_LABEL } from './tours.constants';
import type { TourChoice } from './tour.type';

const tourMenuEntry = (list: readonly TourChoice[], onTour: (id: string) => void): MenuItem | null => {
  const [only] = list;
  if (!only) return null;
  const entry = { key: TOUR_MENU_KEY, label: TOUR_MENU_LABEL, icon: TOUR_ICON };
  if (list.length === 1) return { ...entry, onClick: () => onTour(only.id) };
  return { ...entry, children: list.map((tour) => ({ key: `tour:${tour.id}`, label: tour.title, onClick: () => onTour(tour.id) })) };
};

const tourMenu = { entry: tourMenuEntry };

export { tourMenu };
