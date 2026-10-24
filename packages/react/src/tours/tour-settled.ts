/* @layer renderer-shell @kind logic */
import type { TourState } from './tour.type';

const isTourSettled = (state: Pick<TourState, 'loaded' | 'firstUse' | 'active' | 'starting'>): boolean =>
  state.loaded && !state.firstUse && state.active === null && !state.starting;

export { isTourSettled };
