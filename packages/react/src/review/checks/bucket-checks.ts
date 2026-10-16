/* @layer renderer-shell @kind logic */
import type { BucketSnapshot, ReviewOutcome } from '../review.type';
import { outcome } from './outcome';

const pagesCheck = (snapshot: BucketSnapshot): ReviewOutcome => {
  const { hub, nav, expected, shown } = snapshot;
  if (!nav) {
    return outcome(`${hub}-pages`, shown.length === 0, `the "${hub}" hub shows its page alone, with no nav`, `the "${hub}" hub draws a nav it should leave out: ${shown.join(', ')}`);
  }
  const missing = expected.filter((label) => !shown.includes(label));
  return outcome(`${hub}-pages`, missing.length === 0, `the "${hub}" hub lists ${expected.join(', ')}`, `the "${hub}" hub does not list ${missing.join(', ')}`);
};

const bucketChecks = (snapshot: BucketSnapshot): ReviewOutcome[] => {
  const { hub, reachedVia } = snapshot;
  return [
    outcome(`${hub}-reachable`, reachedVia !== null, `bucket "${hub}" opens from ${reachedVia ?? ''}`, `bucket "${hub}" opens from neither the menu nor the bucket switch`),
    pagesCheck(snapshot),
  ];
};

export { bucketChecks };
