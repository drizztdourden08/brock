/* @layer renderer-shell @kind logic */
import type { BootSnapshot, ReviewOutcome } from '../review.type';
import { outcome } from './outcome';

const slotOutcome = (rendered: readonly boolean[], expected: number): ReviewOutcome => {
  const empty = rendered.flatMap((shown, index) => (shown ? [] : [index + 1]));
  if (rendered.length !== expected) return { id: 'title-bar-slots', pass: false, reason: `${rendered.length} of ${expected} title bar slots mounted` };
  return outcome('title-bar-slots', empty.length === 0, `${expected} title bar slots rendered`, `title bar slot ${empty.join(', ')} rendered nothing`);
};

const bootChecks = (snapshot: BootSnapshot): ReviewOutcome[] => {
  const { titleBarVisible, title, expectedTitle, logoLoaded, searchButton, bugReportButton, slotsRendered, expectedSlots } = snapshot;
  return [
    outcome('title-bar-visible', titleBarVisible, 'the title bar is on screen', 'no visible title bar'),
    outcome('title-text', title === expectedTitle, `the title reads "${expectedTitle}"`, `the title reads "${title ?? '(none)'}", expected "${expectedTitle}"`),
    outcome('title-bar-logo', logoLoaded === true, 'the title bar logo loaded', logoLoaded === null ? 'the title bar has no logo image' : 'the title bar logo did not load'),
    outcome('search-button', searchButton, 'the search button is in the title bar', 'no search button in the title bar'),
    outcome('bug-report-button', bugReportButton, 'the bug report button is in the title bar', 'no bug report button in the title bar'),
    slotOutcome(slotsRendered, expectedSlots),
  ];
};

export { bootChecks };
