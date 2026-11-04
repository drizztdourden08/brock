/* @layer renderer-shell @kind logic */
import type { ReviewOutcome } from '../review.type';
import { HIDDEN_REASON } from './hidden-bucket-checks.constants';
import { outcome } from './outcome';

const hiddenBucketChecks = (hub: string, why: string = HIDDEN_REASON): ReviewOutcome[] => {
  const reason = `skipped: bucket "${hub}" ${why}, so the tour leaves it out`;
  return [outcome(`${hub}-reachable`, true, reason, ''), outcome(`${hub}-pages`, true, reason, '')];
};

export { hiddenBucketChecks };
