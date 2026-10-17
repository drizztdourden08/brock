/* @layer renderer-shell @kind logic */
import { bugReport } from '../../bug-report/bug-report';
import { find } from '../dom/find';
import { waitFor } from '../dom/wait-for';
import { REVIEW_REPORT_TITLE, SELECTORS } from '../review.constants';
import type { StepTour } from '../review.type';
import { escapeCloses } from './escape-closes';

const titleValue = (): string | undefined => (find(SELECTORS.bugReportTitle) as HTMLInputElement | null)?.value;

const titleIs = (value: string): (() => boolean) => () => titleValue() === value;

const clearedTitle = (): boolean => {
  const value = titleValue();
  if (value === undefined || value === REVIEW_REPORT_TITLE) return false;
  return bugReport.hasDefaultTitle() || value === '';
};

const clearedReason = (): string => (bugReport.hasDefaultTitle()
  ? `the prefilled title was gone on the next open, which showed the app's default title "${titleValue() ?? ''}"`
  : 'the prefilled title was gone on the next open, which started empty');

const unclearedReason = (): string => {
  const value = titleValue();
  if (value === undefined) return 'the bug report dialog did not open again';
  return value === REVIEW_REPORT_TITLE ? 'the prefilled title came back on the next open' : `the next open showed "${value}" with no default title set`;
};

const bugReportPrefill = async (tour: StepTour): Promise<void> => {
  bugReport.open({ title: REVIEW_REPORT_TITLE });
  const filled = await waitFor(titleIs(REVIEW_REPORT_TITLE));
  tour.check('bug-report-prefill', filled !== null, 'bugReport.open({ title }) filled the title', 'bugReport.open({ title }) left the title empty');
  await escapeCloses(tour, 'bug-report-prefill', () => find(SELECTORS.bugReportDialog) === null);
  bugReport.open();
  const cleared = await waitFor(clearedTitle);
  tour.check('bug-report-prefill-cleared', cleared !== null, clearedReason(), unclearedReason());
  bugReport.close();
};

export { bugReportPrefill };
