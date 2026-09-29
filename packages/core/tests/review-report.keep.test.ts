/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { buildReviewReport } from '../src/review/build-review-report';
import { renderReviewMarkdown } from '../src/review/render-review-markdown';
import { reviewStepFile } from '../src/review/review-step-file';
import type { ReviewCheck, ReviewRun } from '../src/review/review.type';

const TITLE_CHECK: ReviewCheck = { id: 'title-text', step: 'boot', pass: true, reason: 'the title reads "Demo"' };

const RUN: ReviewRun = {
  name: 'review',
  app: { name: 'Demo', version: '1.2.3', electron: '42.0.0' },
  startedAt: 1_000,
  steps: [{ index: 1, name: 'boot', file: '01-boot.png' }],
  checks: [TITLE_CHECK],
  consoleErrors: [],
  failedLoads: [],
  mainLog: [],
  windowIcon: 'icon.ico',
};

const ENDED = { finished: true, finishedAt: 3_500 };

const checkOf = (run: ReviewRun, id: string, ending = ENDED): ReviewCheck | undefined =>
  buildReviewReport(run, ending).checks.find((check) => check.id === id);

describe('reviewStepFile', () => {
  it('numbers and slugs a step', () => {
    expect(reviewStepFile(3, 'screen-settings')).toBe('03-screen-settings.png');
    expect(reviewStepFile(12, 'Bug Report?')).toBe('12-bug-report.png');
    expect(reviewStepFile(1, '***')).toBe('01-step.png');
  });
});

describe('buildReviewReport', () => {
  it('passes a clean finished run and adds the global checks', () => {
    const report = buildReviewReport(RUN, ENDED);
    expect(report.passed).toBe(true);
    expect(report.durationMs).toBe(2_500);
    expect(report.checks.map((check) => check.id)).toEqual([
      'title-text', 'tour-finished', 'app-version', 'console-errors', 'failed-loads', 'main-log-errors', 'window-icon',
    ]);
  });

  it('fails on a failed tour check', () => {
    expect(buildReviewReport({ ...RUN, checks: [{ ...TITLE_CHECK, pass: false }] }, ENDED).passed).toBe(false);
  });

  it('fails a run the watchdog stopped', () => {
    const check = checkOf(RUN, 'tour-finished', { finished: false, finishedAt: 61_000 });
    expect(check?.pass).toBe(false);
    expect(check?.reason).toContain('stopped after 1 steps');
  });

  it('fails console errors, failed loads and main log errors, with the first one as the reason', () => {
    const run: ReviewRun = {
      ...RUN,
      consoleErrors: ['boom', 'bang'],
      failedLoads: ['logo.png: net::ERR_FILE_NOT_FOUND'],
      mainLog: [{ level: 'warn', message: 'slow' }, { level: 'error', message: 'broken' }],
    };
    expect(checkOf(run, 'console-errors')).toMatchObject({ pass: false, reason: '2 renderer console errors, first: boom' });
    expect(checkOf(run, 'failed-loads')).toMatchObject({ pass: false, reason: '1 failed load: logo.png: net::ERR_FILE_NOT_FOUND' });
    expect(checkOf(run, 'main-log-errors')).toMatchObject({ pass: false, reason: '1 main log error: broken' });
  });

  it('keeps main log warnings out of the error check', () => {
    expect(checkOf({ ...RUN, mainLog: [{ level: 'warn', message: 'slow' }] }, 'main-log-errors')?.pass).toBe(true);
  });

  it('surfaces the window icon warning when no icon resolved', () => {
    const warning = '[window] No icon icon in /logos. The window has no icon.';
    const run: ReviewRun = { ...RUN, windowIcon: null, mainLog: [{ level: 'warn', message: warning }] };
    expect(checkOf(run, 'window-icon')).toMatchObject({ pass: false, reason: warning });
  });

  it('fails an app that reports the Electron version', () => {
    expect(checkOf({ ...RUN, app: { ...RUN.app, version: '42.0.0' } }, 'app-version')?.pass).toBe(false);
  });
});

describe('renderReviewMarkdown', () => {
  it('lists the verdict, steps and checks and escapes table pipes', () => {
    const run = { ...RUN, checks: [{ id: 'menu', step: 'menu', pass: false, reason: 'a | b' }] };
    const markdown = renderReviewMarkdown(buildReviewReport(run, ENDED));
    expect(markdown).toContain('Result: FAIL (1 of 7 checks failed)');
    expect(markdown).toContain('| 1 | boot | 01-boot.png |');
    expect(markdown).toContain(String.raw`| FAIL | menu | menu | a \| b |`);
    expect(markdown).toContain('## Console errors\n\nNone.');
  });
});
