/* @layer renderer-shell @kind logic */
import type { TourDef, TourLoader } from './tour.type';

const loaded = new WeakMap<TourLoader, TourDef>();

const resolve = (tour: TourDef): TourDef => {
  const full = tour.load ? loaded.get(tour.load) : undefined;
  return full?.id === tour.id ? full : tour;
};

const loadedTours = {
  keep: (load: TourLoader, tour: TourDef): void => { loaded.set(load, tour); },
  resolve,
};

export { loadedTours };
