/* @layer renderer-shell @kind logic */
import type { CheckCounts } from './check-counts.type';

const percentOf = (counts: CheckCounts): number => (counts.total > 0 ? Math.round((counts.taken / counts.total) * 100) : 0);

export { percentOf };
