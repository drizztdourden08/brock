/* @layer renderer-shell @kind logic */
import type { ReviewOutcome, ViewMenuSnapshot } from '../review.type';
import { outcome } from './outcome';

const viewMenuChecks = (snapshot: ViewMenuSnapshot, expected: readonly string[]): ReviewOutcome[] => {
  if (!snapshot.open) return [{ id: 'menu-view-opens', pass: false, reason: 'the View sub-menu did not open' }];
  const missing = expected.filter((label) => !snapshot.labels.includes(label));
  return [
    outcome('menu-view-opens', true, `the View sub-menu opened with ${snapshot.labels.length} entries`, ''),
    outcome('menu-view-items', missing.length === 0, `the View sub-menu has ${expected.join(', ')}`, `the View sub-menu lacks ${missing.join(', ')}`),
  ];
};

export { viewMenuChecks };
