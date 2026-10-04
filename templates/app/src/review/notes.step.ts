/* @layer renderer-app @kind logic */
import { defineReviewStep } from '@drizztdourden08/brock-react';

export default defineReviewStep({
  run: async (tour) => {
    const panel = await tour.openWidget('notes');
    const box = panel ? tour.find('textarea', panel) : null;
    const text = box instanceof HTMLTextAreaElement ? box.value : '';
    tour.check('notes-shows-seed', text.length > 0, 'the Notes widget shows the seeded note', 'the Notes widget opened empty or did not open');
    await tour.capture('widget');
  },
});
