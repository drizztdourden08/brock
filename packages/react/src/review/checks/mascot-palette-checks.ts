/* @layer renderer-shell @kind logic */
import type { WalkerReading } from '../dom/read-walker.type';
import type { ReviewOutcome } from '../review.type';
import { mascotApart } from './mascot-apart';
import { outcome } from './outcome';

const paletteChecks = (reading: WalkerReading): ReviewOutcome[] => [
  outcome('mascot-beside-palette', mascotApart(reading), 'the mascot stands beside the search palette', 'the mascot is not beside the search palette'),
  outcome('mascot-search-hint', reading.hint !== null && reading.hint.length > 0, `the mascot says "${reading.hint}"`, 'the mascot shows no search hint beside the palette'),
];

export { paletteChecks };
