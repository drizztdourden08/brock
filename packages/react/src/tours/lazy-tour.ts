/* @layer renderer-shell @kind logic */
import type { TourDef, TourLoader, TourShell } from './tour.type';

const lazyTour = (shell: TourShell, load: TourLoader): TourDef => ({ ...shell, id: '', steps: [], load });

export { lazyTour };
