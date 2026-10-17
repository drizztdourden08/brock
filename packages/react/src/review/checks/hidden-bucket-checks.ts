/* @layer renderer-shell @kind logic */
import type { ReviewOutcome } from '../review.type';
import { outcome } from './outcome';

const hiddenBucketChecks = (hub: string): ReviewOutcome[] => {
  const reason = `skipped: bucket "${hub}" is hidden here (its hosts or when rule is false for the active profile), so the tour leaves it out`;
  return [outcome(`${hub}-reachable`, true, reason, ''), outcome(`${hub}-pages`, true, reason, '')];
};

export { hiddenBucketChecks };
