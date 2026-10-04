/* @layer renderer-shell @kind logic */
import type { ReviewOutcome, ViewMenuSnapshot } from '../review.type';
import { outcome } from './outcome';

const windowGroupMenuChecks = (snapshot: ViewMenuSnapshot, expected: readonly string[]): ReviewOutcome[] => {
  const same = snapshot.labels.length === expected.length && expected.every((label, i) => snapshot.labels[i] === label);
  return [
    outcome(
      'menu-view-window-group',
      snapshot.open && same,
      `View > Window group lists ${expected.join(', ')}`,
      snapshot.open ? `View > Window group lists ${snapshot.labels.join(', ')}, expected ${expected.join(', ')}` : 'View > Window group did not open',
    ),
  ];
};

export { windowGroupMenuChecks };
