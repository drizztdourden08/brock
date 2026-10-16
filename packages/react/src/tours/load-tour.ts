/* @layer renderer-shell @kind logic */
import { lazyLoads } from '../lazy/lazy-loads';
import { getAppLog } from '../log/get-app-log';
import { loadedTours } from './loaded-tours';
import type { TourDef } from './tour.type';
import { useTourStore } from './useTourStore';

const tourOf = (id: string): TourDef | null => useTourStore.getState().tours.find((tour) => tour.id === id) ?? null;

const loadTour = async (id: string): Promise<TourDef | null> => {
  const tour = tourOf(id);
  const load = tour?.load;
  if (!tour || !load || tour.steps.length > 0) return tour;
  try {
    const module = await lazyLoads.track(load());
    loadedTours.keep(load, { ...module.default, id, load });
    const { tours, setTours } = useTourStore.getState();
    setTours(tours);
    return tourOf(id);
  } catch (error) {
    getAppLog().log('app', `Tour "${id}" could not load: ${error instanceof Error ? error.message : String(error)}`, 'error');
    return null;
  }
};

export { loadTour };
