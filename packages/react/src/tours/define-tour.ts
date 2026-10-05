/* @layer renderer-shell @kind logic */
import type { TourDef } from './tour.type';

const defineTour = <T extends TourDef>(tour: T): T => tour;

export { defineTour };
