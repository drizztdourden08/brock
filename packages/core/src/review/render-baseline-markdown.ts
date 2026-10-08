/* @layer core @kind logic */
import type { BaselineReport, BaselineResult } from './baseline.type';
import { baselineShare } from './baseline-share';
import { isBaselineFailure } from './is-baseline-failure';

const cell = (text: string): string => text.replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');

const row = (result: BaselineResult): string =>
  `| ${cell(result.capture)} | ${cell(result.step)} | ${result.status} | ${result.diffPixels} | ${baselineShare(result.ratio)} | ${result.diff ?? cell(result.detail ?? '')} |`;

const blessLines = (report: BaselineReport): string[] => {
  if (report.refused && report.refused.length > 0) {
    return [`Did not bless the ${report.platform} set in ${report.dir}: these checks failed. Fix them, or bless anyway with \`--review-bless --force\`.`, '', ...report.refused.map((check) => `- ${cell(check)}`)];
  }
  const removed = report.results.filter((result) => result.status === 'unused');
  return [
    `Blessed ${report.results.length - removed.length} captures as the ${report.platform} set in ${report.dir}.`,
    ...(removed.length === 0 ? [] : ['', 'Removed, no longer captured:', '', ...removed.map((result) => `- ${cell(result.capture)}`)]),
  ];
};

const compareLines = (report: BaselineReport): string[] => {
  const failures = report.results.filter(isBaselineFailure);
  const head = `Compared ${report.results.length} captures with the ${report.platform} set in ${report.dir}: ${failures.length === 0 ? 'all match' : `${failures.length} failed`}.`;
  if (failures.length === 0) return [head];
  return [head, '', '| Capture | Step | Result | Pixels | Share | Diff |', '|---|---|---|---|---|---|', ...failures.map(row)];
};

const renderBaselineMarkdown = (report: BaselineReport | undefined): string[] => {
  if (!report) return [];
  return ['## Baselines', '', ...(report.mode === 'bless' ? blessLines(report) : compareLines(report)), ''];
};

export { renderBaselineMarkdown };
