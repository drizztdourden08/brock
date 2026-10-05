/* @layer renderer-shell @kind logic */
import type { TourDef, TourEntry } from './tour.type';

const toursFromFiles = (entries: readonly TourEntry[]): readonly TourDef[] =>
  [...entries].sort((a, b) => a.id.localeCompare(b.id)).map(({ id, tour }) => (tour.id === id ? tour : { ...tour, id }));

export { toursFromFiles };
