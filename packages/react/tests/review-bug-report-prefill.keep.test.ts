/* @layer renderer-shell @kind test */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { bugReport } from '../src/bug-report/bug-report';
import { useBugReportStore } from '../src/bug-report/useBugReportStore';
import { REVIEW_REPORT_TITLE } from '../src/review/review.constants';
import type { ReviewOutcome, StepTour } from '../src/review/review.type';
import { recordingTour } from './review-outcomes';

const field = vi.hoisted(() => ({ typed: null as string | null }));

vi.mock('../src/review/dom/find', async () => {
  const { useBugReportStore: store } = await import('../src/bug-report/useBugReportStore');
  const { SELECTORS: selectors } = await import('../src/review/review.constants');
  return {
    find: (selector: string) => {
      const { open, prefill } = store.getState();
      if (!open) return null;
      return selector === selectors.bugReportTitle ? { value: field.typed ?? prefill ?? '' } : {};
    },
  };
});

vi.mock('../src/review/steps/escape-closes', () => ({
  escapeCloses: (tour: StepTour, what: string) => {
    bugReport.close();
    tour.check(`${what}-escape`, true, 'closed', '');
    return Promise.resolve();
  },
}));

const { bugReportPrefill } = await import('../src/review/steps/bug-report-prefill');

const runStep = async (): Promise<ReviewOutcome | undefined> => {
  const { tour, checks } = recordingTour();
  await bugReportPrefill(tour);
  return checks.find((check) => check.id === 'bug-report-prefill-cleared');
};

const defaultOnOpen = (title: string): (() => void) => useBugReportStore.subscribe((now, before) => {
  if (now.open && !before.open && now.prefill === null) bugReport.setDefaultTitle(title);
});

afterEach(() => {
  field.typed = null;
  useBugReportStore.setState({ open: false, prefill: null, prefillIsDefault: false });
});

describe('the bug report prefill check', () => {
  it('tells a default title from an explicit one', () => {
    bugReport.setDefaultTitle('Import failed');
    expect(bugReport.hasDefaultTitle()).toBe(true);
    bugReport.open({ title: 'Typed by the caller' });
    expect(bugReport.hasDefaultTitle()).toBe(false);
    bugReport.close();
    expect(useBugReportStore.getState()).toMatchObject({ prefill: null, prefillIsDefault: false });
    bugReport.setDefaultTitle('Import failed');
    bugReport.setDefaultTitle(null);
    expect(bugReport.hasDefaultTitle()).toBe(false);
  });

  it('expects an empty title on the next open when the app sets no default', async () => {
    const cleared = await runStep();
    expect(cleared).toMatchObject({ pass: true, reason: expect.stringContaining('started empty') as string });
  });

  it('passes when the app fills a default title on every open', async () => {
    const stop = defaultOnOpen('My App 1.0 on the home screen');
    const cleared = await runStep();
    stop();
    expect(cleared).toMatchObject({ pass: true, reason: expect.stringContaining('My App 1.0 on the home screen') as string });
  });

  it('fails when the review prefill comes back', async () => {
    const stop = useBugReportStore.subscribe((now, before) => {
      if (now.open && !before.open && now.prefill === null) useBugReportStore.setState({ prefill: REVIEW_REPORT_TITLE });
    });
    const cleared = await runStep();
    stop();
    expect(cleared).toMatchObject({ pass: false, reason: 'the prefilled title came back on the next open' });
  });

  it('fails when the next open shows a title with no default set', async () => {
    const stop = useBugReportStore.subscribe((now, before) => {
      if (now.open && !before.open && now.prefill === null) field.typed = 'Left over';
    });
    const cleared = await runStep();
    stop();
    expect(cleared).toMatchObject({ pass: false, reason: 'the next open showed "Left over" with no default title set' });
  });
});
