/* @layer renderer-shell @kind logic */
import { tourProgress } from './tour-progress';
import { tourEvents } from './tour-events';
import type { TourDef } from './tour.type';
import { useTourStore } from './useTourStore';

const state = () => useTourStore.getState();

const tourOf = (id: string): TourDef | null => state().tours.find((tour) => tour.id === id) ?? null;

const activeTour = (): TourDef | null => {
  const { active } = state();
  return active ? tourOf(active.id) : null;
};

const start = (id: string, at?: number): boolean => {
  const tour = tourOf(id);
  if (!tour || tour.steps.length === 0) return false;
  const { progress, setProgress, setActive } = state();
  const index = tourProgress.startStep(progress, tour, at);
  setProgress(tourProgress.started(progress, id, index));
  setActive({ id, index });
  return true;
};

const stop = (): void => state().setActive(null);

const complete = (id: string): void => {
  const { progress, setProgress } = state();
  setProgress(tourProgress.completed(progress, id));
};

const goTo = (index: number): void => {
  const { active, progress, setProgress, setActive } = state();
  const tour = activeTour();
  if (!active || !tour) return;
  const next = Math.min(Math.max(0, index), tour.steps.length - 1);
  if (next === active.index) return;
  setActive({ id: active.id, index: next });
  setProgress(tourProgress.step(progress, active.id, next));
};

const next = (): void => {
  const { active } = state();
  const tour = activeTour();
  if (!active || !tour) return;
  if (active.index < tour.steps.length - 1) {
    goTo(active.index + 1);
    return;
  }
  stop();
  complete(active.id);
};

const back = (): void => {
  const { active } = state();
  if (active) goTo(active.index - 1);
};

const startFirstRun = (): boolean => {
  const { active, tours: list, progress, loaded, firstUse, setFirstUse } = state();
  if (!loaded || !firstUse) return false;
  setFirstUse(false);
  const tour = active ? null : tourProgress.firstRun(list, progress);
  return tour ? start(tour.id, 0) : false;
};

const tours = {
  start,
  stop,
  next,
  back,
  goTo,
  complete,
  startFirstRun,
  emit: tourEvents.emit,
  list: (): readonly TourDef[] => state().tours,
  isOpen: (): boolean => state().active !== null,
  isCompleted: (id: string): boolean => state().progress.completed.includes(id),
};

export { tours };
