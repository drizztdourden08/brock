/* @layer renderer-shell @kind logic */
import { MAX_SHARE, MIN_SHARE } from './widget-resize-edit.constants';
import type { ShareLimit } from './widget-resize-edit.type';

const asPercent = (share: number): number => Math.round(share * 100);

const shareLimit = (free: number, size: number): ShareLimit => {
  const least = Math.round(free * MIN_SHARE);
  const most = Math.round(free * MAX_SHARE);
  if (size > most) return { size: most, reason: `${Math.round(size)} px is more than the ${most} px an edge can take here (${asPercent(MAX_SHARE)}% of the space across the split), so ${most} px was used.` };
  if (size < least) return { size: least, reason: `${Math.round(size)} px is less than the ${least} px an edge can take here (${asPercent(MIN_SHARE)}% of the space across the split), so ${least} px was used.` };
  return { size, reason: null };
};

export { shareLimit };
