/* @layer renderer-shell @kind logic */
import { isRecord } from '../collections/is-record';
import { EMPTY_PROGRESS } from './tours.constants';
import type { TourDef, TourProgress } from './tour.type';

const ids = (value: unknown): string[] => (Array.isArray(value) ? value.filter((id): id is string => typeof id === 'string') : []);

const steps = (value: unknown): Record<string, number> => {
  if (!isRecord(value)) return {};
  return Object.fromEntries(Object.entries(value).filter((entry): entry is [string, number] => typeof entry[1] === 'number' && Number.isInteger(entry[1]) && entry[1] >= 0));
};

const readProgress = (stored: unknown): TourProgress => {
  if (!isRecord(stored)) return EMPTY_PROGRESS;
  return { completed: ids(stored.completed), started: ids(stored.started), last: steps(stored.last) };
};

const withId = (list: readonly string[], id: string): readonly string[] => (list.includes(id) ? list : [...list, id]);

const withoutLast = (last: TourProgress['last'], id: string): TourProgress['last'] =>
  Object.fromEntries(Object.entries(last).filter(([key]) => key !== id));

const markStarted = (progress: TourProgress, id: string, index: number): TourProgress =>
  ({ ...progress, started: withId(progress.started, id), last: { ...progress.last, [id]: index } });

const markStep = (progress: TourProgress, id: string, index: number): TourProgress =>
  (progress.last[id] === index ? progress : { ...progress, last: { ...progress.last, [id]: index } });

const markCompleted = (progress: TourProgress, id: string): TourProgress =>
  ({ ...progress, completed: withId(progress.completed, id), started: withId(progress.started, id), last: withoutLast(progress.last, id) });

const clampStep = (index: number, tour: TourDef): number => Math.min(Math.max(0, Math.trunc(index)), Math.max(0, tour.steps.length - 1));

const startStep = (progress: TourProgress, tour: TourDef, at?: number): number => {
  if (at !== undefined) return clampStep(at, tour);
  if (progress.completed.includes(tour.id)) return 0;
  return clampStep(progress.last[tour.id] ?? 0, tour);
};

const firstRunTour = (tours: readonly TourDef[], progress: TourProgress): TourDef | null =>
  tours.find((tour) => tour.trigger === 'first-run' && tour.steps.length > 0 && !progress.started.includes(tour.id)) ?? null;

const union = (a: readonly string[], b: readonly string[]): readonly string[] => [...new Set([...a, ...b])];

const mergeProgress = (into: TourProgress, from: TourProgress): TourProgress =>
  ({ completed: union(into.completed, from.completed), started: union(into.started, from.started), last: { ...from.last, ...into.last } });

const tourProgress = { read: readProgress, merge: mergeProgress, started: markStarted, step: markStep, completed: markCompleted, startStep, firstRun: firstRunTour };

export { tourProgress };
