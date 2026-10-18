/* @layer renderer-shell @kind logic */
import type { WalkerReading } from '../dom/read-walker.type';
import type { ReviewOutcome } from '../review.type';
import { SLACK } from './mascot-checks.constants';
import { outcome } from './outcome';

const atBottom = ({ card, walker }: WalkerReading): boolean =>
  card !== null && walker !== null && Math.abs(walker.bottom - card.bottom) <= SLACK && walker.left >= card.left - SLACK && walker.right <= card.right + SLACK;

const windowChecks = (reading: WalkerReading): ReviewOutcome[] => [
  outcome('mascot-window', reading.walker !== null, 'the brand mascot walks in the open window', 'no mascot walks in the open window'),
  outcome('mascot-window-bottom', atBottom(reading), 'the mascot stands along the bottom edge of the window', 'the mascot is not along the bottom edge of the window'),
];

export { windowChecks };
