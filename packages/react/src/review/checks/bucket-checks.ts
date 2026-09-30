/* @layer renderer-shell @kind logic */
import type { BucketSnapshot, ReviewOutcome } from '../review.type';
import { outcome } from './outcome';

const bucketChecks = (snapshot: BucketSnapshot): ReviewOutcome[] => {
  const { hub, reachedVia, expected, shown } = snapshot;
  const missing = expected.filter((label) => !shown.includes(label));
  return [
    outcome(`${hub}-reachable`, reachedVia !== null, `bucket "${hub}" opens from ${reachedVia ?? ''}`, `bucket "${hub}" opens from neither the menu nor the bucket switch`),
    outcome(`${hub}-pages`, missing.length === 0, `the "${hub}" hub lists ${expected.join(', ')}`, `the "${hub}" hub does not list ${missing.join(', ')}`),
  ];
};

export { bucketChecks };
