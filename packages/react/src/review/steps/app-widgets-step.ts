/* @layer renderer-shell @kind logic */
import { nav } from '../../navigation/nav';
import { BUILT_IN_WIDGETS } from '../../widgets/built-in-widgets.constants';
import { useWidgetLayoutStore } from '../../widgets/useWidgetLayoutStore';
import type { ReviewStep } from '../review.type';
import { reviewAppWidget } from './review-app-widget';

const builtIn = new Set(BUILT_IN_WIDGETS.map((def) => def.id));

const appWidgetsStep: ReviewStep = {
  name: 'app-widgets',
  run: async (tour) => {
    const own = useWidgetLayoutStore.getState().definitions.filter((def) => !builtIn.has(def.id));
    if (own.length === 0) {
      tour.check('app-widgets', true, 'the app and its modules register no widget of their own', '');
      return;
    }
    nav.close();
    for (const def of own) await reviewAppWidget(tour, def);
  },
};

export { appWidgetsStep };
