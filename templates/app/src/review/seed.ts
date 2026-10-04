/* @layer renderer-app @kind logic */
import { defineReviewSeed, useWidgetPrefStore } from '@drizztdourden08/brock-react';

export default defineReviewSeed({
  run: async (tour) => {
    useWidgetPrefStore.getState().setPref('notes', 'text', 'Review notes: the seed wrote this before the tour, so the Notes widget is captured with content.');
    await tour.settle();
    const stored = useWidgetPrefStore.getState().byWidget.notes?.text;
    tour.check('notes-seeded', typeof stored === 'string' && stored.length > 0, 'the Notes widget holds a seeded note', 'the seeded note did not reach the widget prefs');
  },
});
