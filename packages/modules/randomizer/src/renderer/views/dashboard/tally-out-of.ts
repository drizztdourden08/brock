/* @layer renderer-shell @kind logic */
import type { Tally } from './tally.type';

const tallyOutOf = (tally: Tally): string => `${tally.count} of ${tally.total}`;

export { tallyOutOf };
