/* @layer renderer-shell @kind logic */
import type { BootSnapshot, ReviewOutcome } from '../review.type';
import { outcome } from './outcome';

const barOutcome = (shown: readonly string[], expected: readonly string[]): ReviewOutcome => {
  const missing = expected.filter((id) => !shown.includes(id));
  return outcome('title-bar-actions', missing.length === 0, `${expected.length} title bar actions drawn in the bar`, `no bar item for the title bar action ${missing.join(', ')}`);
};

const bootChecks = (snapshot: BootSnapshot): ReviewOutcome[] => {
  const { titleBarVisible, title, expectedTitle, logoLoaded, searchButton, bugReportButton, barItems, expectedBarItems } = snapshot;
  return [
    outcome('title-bar-visible', titleBarVisible, 'the title bar is on screen', 'no visible title bar'),
    outcome('title-text', title === expectedTitle, `the title reads "${expectedTitle}"`, `the title reads "${title ?? '(none)'}", expected "${expectedTitle}"`),
    outcome('title-bar-logo', logoLoaded === true, 'the title bar logo loaded', logoLoaded === null ? 'the title bar has no logo image' : 'the title bar logo did not load'),
    outcome('search-button', searchButton, 'the search action is in the title bar', 'no search action in the title bar'),
    outcome('bug-report-button', bugReportButton, 'the bug report action is in the title bar', 'no bug report action in the title bar'),
    barOutcome(barItems, expectedBarItems),
  ];
};

export { bootChecks };
