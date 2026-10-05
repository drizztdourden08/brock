/* @layer renderer-app @kind logic */
import { defineReviewSeed, useWidgetPrefStore } from '@drizztdourden08/brock-react';

const FIXTURE_NOTE = 'notes/review-note.txt';

export default defineReviewSeed({
  run: async (tour) => {
    const note = await tour.platform.files.readText(FIXTURE_NOTE);
    tour.check('note-fixture', note !== null, `src/review/fixtures/${FIXTURE_NOTE} is in the data folder`, `src/review/fixtures/${FIXTURE_NOTE} was not copied`);
    useWidgetPrefStore.getState().setPref('notes', 'text', note?.trim() ?? 'Review notes: the seed wrote this before the tour.');
    await tour.settle();
    const stored = useWidgetPrefStore.getState().byWidget.notes?.text;
    tour.check('notes-seeded', typeof stored === 'string' && stored.length > 0, 'the Notes widget holds a seeded note', 'the seeded note did not reach the widget prefs');
  },
});
