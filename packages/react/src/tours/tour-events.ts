/* @layer renderer-shell @kind logic */
import type { TourEventListener } from './tour.type';

const listeners = new Set<TourEventListener>();

const tourEvents = {
  emit: (name: string): void => {
    for (const listener of [...listeners]) listener(name);
  },
  on: (listener: TourEventListener): (() => void) => {
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  },
};

export { tourEvents };
