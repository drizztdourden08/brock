/* @layer renderer-shell @kind logic */
import type { RunTile } from './run-tile.type';
import { tallyOutOf } from './tally-out-of';
import type { Tally } from './tally.type';

const tallyTile = (label: string, tally: Tally): RunTile =>
  ({ label, value: tallyOutOf(tally), meter: { value: tally.count, max: tally.total } });

export { tallyTile };
