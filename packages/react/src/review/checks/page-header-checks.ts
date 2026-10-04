/* @layer renderer-shell @kind logic */
import type { PageHeaderSnapshot, ReviewOutcome } from '../review.type';
import { outcome } from './outcome';

const describeHeader = (snapshot: PageHeaderSnapshot, title: string | null): string => {
  if (!snapshot.shown) return 'shows no page header';
  const expected = title === null ? '' : `, expected "${title}"`;
  return `has a page header with ${snapshot.icon ? 'an icon' : 'no icon'} and the title "${snapshot.title ?? ''}"${expected}`;
};

const pageHeaderChecks = (id: string, title: string | null, snapshot: PageHeaderSnapshot): ReviewOutcome[] => {
  const named = snapshot.title !== null && (title === null || snapshot.title === title);
  return [
    outcome(
      `${id}-page-header`,
      snapshot.shown && snapshot.icon && named,
      `"${id}" shows the page header with its icon and the title "${snapshot.title ?? ''}"`,
      `"${id}" ${describeHeader(snapshot, title)}`,
    ),
  ];
};

export { pageHeaderChecks };
