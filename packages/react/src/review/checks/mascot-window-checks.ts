/* @layer renderer-shell @kind logic */
import type { WalkerReading } from '../dom/read-walker.type';
import type { ReviewOutcome } from '../review.type';
import { SLACK } from './mascot-checks.constants';
import { outcome } from './outcome';

const atBottom = ({ app, walker }: WalkerReading): boolean =>
  app !== null && walker !== null && Math.abs(walker.bottom - app.bottom) <= SLACK && walker.left >= app.left - SLACK && walker.right <= app.right + SLACK;

const windowChecks = (reading: WalkerReading): ReviewOutcome[] => [
  outcome('mascot-window', reading.walker !== null, 'the brand mascot walks in the app', 'no mascot walks in the app'),
  outcome('mascot-window-bottom', atBottom(reading), 'the mascot stands along the bottom edge of the app', 'the mascot is not along the bottom edge of the app'),
];

export { windowChecks };
