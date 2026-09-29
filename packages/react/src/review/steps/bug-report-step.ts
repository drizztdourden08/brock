/* @layer renderer-shell @kind logic */
import { click } from '../dom/click';
import { find } from '../dom/find';
import { waitFor } from '../dom/wait-for';
import { SELECTORS } from '../review.constants';
import type { ReviewStep } from '../review.type';
import { escapeCloses } from './escape-closes';

const bugReportStep: ReviewStep = {
  name: 'bug-report',
  run: async (tour) => {
    const button = find(SELECTORS.bugReportButton);
    if (button) click(button);
    const opened = await waitFor(() => find(SELECTORS.bugReportDialog));
    tour.check('bug-report-opens', opened !== null, 'the title bar button opened the bug report dialog', 'the title bar button did not open the bug report dialog');
    if (opened === null) return;
    await tour.capture('bug-report');
    await escapeCloses(tour, 'bug-report', () => find(SELECTORS.bugReportDialog) === null);
  },
};

export { bugReportStep };
