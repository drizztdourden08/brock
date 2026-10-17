/* @layer renderer-shell @kind logic */
import type { ReviewOutcome } from '../review.type';
import type { WalkerReading } from '../dom/read-walker';
import { outcome } from './outcome';

const SLACK = 2;

const atBottom = ({ card, walker }: WalkerReading): boolean =>
  card !== null && walker !== null && Math.abs(walker.bottom - card.bottom) <= SLACK && walker.left >= card.left - SLACK && walker.right <= card.right + SLACK;

const apart = ({ actor, palette }: WalkerReading): boolean =>
  actor !== null && palette !== null && (actor.right <= palette.left || actor.left >= palette.right);

const windowChecks = (reading: WalkerReading): ReviewOutcome[] => [
  outcome('mascot-window', reading.walker !== null, 'the brand mascot walks in the open window', 'no mascot walks in the open window'),
  outcome('mascot-window-bottom', atBottom(reading), 'the mascot stands along the bottom edge of the window', 'the mascot is not along the bottom edge of the window'),
];

const paletteChecks = (reading: WalkerReading): ReviewOutcome[] => [
  outcome('mascot-beside-palette', apart(reading), 'the mascot stands beside the search palette', 'the mascot is not beside the search palette'),
  outcome('mascot-search-hint', reading.hint !== null && reading.hint.length > 0, `the mascot says "${reading.hint}"`, 'the mascot shows no search hint beside the palette'),
];

export { paletteChecks, windowChecks };
