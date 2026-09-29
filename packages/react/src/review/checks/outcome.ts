/* @layer renderer-shell @kind logic */
import type { ReviewOutcome } from '../review.type';

const outcome = (id: string, pass: boolean, passReason: string, failReason: string): ReviewOutcome =>
  ({ id, pass, reason: pass ? passReason : failReason });

export { outcome };
