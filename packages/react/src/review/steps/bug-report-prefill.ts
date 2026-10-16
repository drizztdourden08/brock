/* @layer renderer-shell @kind logic */
import { bugReport } from '../../bug-report/bug-report';
import { find } from '../dom/find';
import { waitFor } from '../dom/wait-for';
import { REVIEW_REPORT_TITLE, SELECTORS } from '../review.constants';
import type { StepTour } from '../review.type';
import { escapeCloses } from './escape-closes';

const titleIs = (value: string): (() => boolean) => () => (find(SELECTORS.bugReportTitle) as HTMLInputElement | null)?.value === value;

const bugReportPrefill = async (tour: StepTour): Promise<void> => {
  bugReport.open({ title: REVIEW_REPORT_TITLE });
  const filled = await waitFor(titleIs(REVIEW_REPORT_TITLE));
  tour.check('bug-report-prefill', filled !== null, 'bugReport.open({ title }) filled the title', 'bugReport.open({ title }) left the title empty');
  await escapeCloses(tour, 'bug-report-prefill', () => find(SELECTORS.bugReportDialog) === null);
  bugReport.open();
  const cleared = await waitFor(() => find(SELECTORS.bugReportTitle) !== null && titleIs('')());
  tour.check('bug-report-prefill-cleared', cleared !== null, 'the prefilled title was gone on the next open', 'the prefilled title came back on the next open');
  bugReport.close();
};

export { bugReportPrefill };
