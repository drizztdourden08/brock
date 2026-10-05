/* @layer renderer-shell @kind logic */
import type { TourDef } from './tour.type';

const uniqueTours = (list: readonly TourDef[], warn: (message: string) => void): TourDef[] => {
  const seen = new Set<string>();
  return list.filter((tour) => {
    if (seen.has(tour.id)) {
      warn(`Tour "${tour.id}" is dropped: another tour already uses that id.`);
      return false;
    }
    seen.add(tour.id);
    return true;
  });
};

export { uniqueTours };
