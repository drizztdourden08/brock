/* @layer renderer-shell @kind logic */
import { PERCENT } from '../PerformanceWidget.constants';

const memoryShare = (usedBytes: number, totalBytes: number | null): number | null =>
  (totalBytes !== null && totalBytes > 0 ? Math.min(PERCENT, (usedBytes / totalBytes) * PERCENT) : null);

export { memoryShare };
