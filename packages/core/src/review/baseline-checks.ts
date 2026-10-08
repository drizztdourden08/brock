/* @layer core @kind logic */
import { BASELINE_CHECK, BASELINES_CHECK } from './baseline.constants';
import type { BaselineReport, BaselineResult } from './baseline.type';
import { baselineShare } from './baseline-share';
import { isBaselineFailure } from './is-baseline-failure';
import { GLOBAL_STEP } from './review.constants';
import type { ReviewCheck } from './review.type';

const failureReason = (result: BaselineResult, platform: string): string => {
  if (result.detail !== undefined) return `"${result.capture}": ${result.detail}`;
  switch (result.status) {
    case 'differs':
      return `"${result.capture}" differs from the ${platform} baseline in ${result.diffPixels} pixels (${baselineShare(result.ratio)}, tolerance ${baselineShare(result.tolerance)}); diff image ${result.diff ?? 'not written'}${result.settled === false ? '; the screen was still changing when it was captured' : ''}`;
    case 'size':
      return `"${result.capture}": the size differs from the baseline`;
    case 'missing':
      return `"${result.capture}" has no ${platform} baseline; bless the set with --review-bless`;
    case 'unused':
      return `the ${platform} baseline "${result.capture}" was not captured in this run`;
    case 'match':
    case 'blessed':
      return `"${result.capture}" matches`;
  }
};

const summary = (report: BaselineReport, failures: number): ReviewCheck => {
  const total = report.results.length;
  if (report.mode === 'bless') {
    const removed = report.results.filter((result) => result.status === 'unused').length;
    return { id: BASELINES_CHECK, step: GLOBAL_STEP, pass: true, reason: `blessed ${total - removed} captures as the ${report.platform} baselines in ${report.dir}, removed ${removed}` };
  }
  return {
    id: BASELINES_CHECK,
    step: GLOBAL_STEP,
    pass: failures === 0 && total > 0,
    reason: failures === 0
      ? `${total} captures match the ${report.platform} baselines in ${report.dir}`
      : `${failures} of ${total} captures do not match the ${report.platform} baselines in ${report.dir}`,
  };
};

const baselineChecks = (report: BaselineReport): ReviewCheck[] => {
  const failures = report.mode === 'compare' ? report.results.filter(isBaselineFailure) : [];
  return [
    ...failures.map((result) => ({ id: BASELINE_CHECK, step: result.step, pass: false, reason: failureReason(result, report.platform) })),
    summary(report, failures.length),
  ];
};

export { baselineChecks };
