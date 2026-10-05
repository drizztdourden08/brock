/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import { tours } from './tours';
import type { TourApi } from './tour.type';
import { useTourStore } from './useTourStore';

const useTour = (): TourApi => {
  const list = useTourStore((s) => s.tours);
  const active = useTourStore((s) => s.active);
  const completed = useTourStore((s) => s.progress.completed);

  return useMemo(() => {
    const tour = active ? list.find((entry) => entry.id === active.id) ?? null : null;
    return {
      active,
      tour,
      step: tour && active ? tour.steps[active.index] ?? null : null,
      tours: list,
      start: tours.start,
      stop: tours.stop,
      next: tours.next,
      back: tours.back,
      isCompleted: (id: string) => completed.includes(id),
    };
  }, [list, active, completed]);
};

export { useTour };
