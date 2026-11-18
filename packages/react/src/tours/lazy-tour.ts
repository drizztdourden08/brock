/* @layer renderer-shell @kind logic */
import { shellText } from './shell-text';
import type { TourDef, TourLoader, TourShell } from './tour.type';

const lazyTour = (shell: TourShell, load: TourLoader): TourDef => {
  const { title, description, ...rest } = shell;
  return { ...rest, title: shellText(title), ...(description === undefined ? {} : { description: shellText(description) }), id: '', steps: [], load };
};

export { lazyTour };
