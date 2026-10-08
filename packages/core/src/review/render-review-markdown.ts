/* @layer core @kind logic */
import { renderBaselineMarkdown } from './render-baseline-markdown';
import type { ReviewReport } from './review.type';

const cell = (text: string): string => text.replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');

const listOr = (items: readonly string[], empty: string): string[] =>
  (items.length === 0 ? [empty] : items.map((item) => `- ${cell(item)}`));

const renderReviewMarkdown = (report: ReviewReport): string => {
  const failed = report.checks.filter((check) => !check.pass).length;
  const verdict = report.passed ? 'PASS' : `FAIL (${failed} of ${report.checks.length} checks failed)`;
  return [
    `# Review: ${report.app.name} ${report.app.version}`,
    '',
    `Result: ${verdict}. Run "${report.name}", ${report.durationMs} ms, ${report.finished ? 'finished' : 'stopped by the watchdog'}.`,
    '',
    '## Steps',
    '',
    '| # | Step | Screenshot |',
    '|---|---|---|',
    ...report.steps.map((step) => `| ${step.index} | ${cell(step.name)} | ${step.file} |`),
    '',
    '## Checks',
    '',
    '| Result | Step | Check | Reason |',
    '|---|---|---|---|',
    ...report.checks.map((check) => `| ${check.pass ? 'pass' : 'FAIL'} | ${cell(check.step)} | ${cell(check.id)} | ${cell(check.reason)} |`),
    '',
    ...renderBaselineMarkdown(report.baselines),
    '## Console errors',
    '',
    ...listOr(report.consoleErrors, 'None.'),
    '',
    '## Failed loads',
    '',
    ...listOr(report.failedLoads, 'None.'),
    '',
    '## Main log warnings and errors',
    '',
    ...listOr(report.mainLog.map((line) => `${line.level}: ${line.message}`), 'None.'),
    '',
  ].join('\n');
};

export { renderReviewMarkdown };
