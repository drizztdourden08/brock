/* @layer core @kind logic */
import type { OnlineHost } from '../../archipelago';
import { armOnlineRun } from './arm-online-run';
import { flushCollected } from './flush-collected';
import type { OnlineParts } from './online-parts.type';

const hostScouted = <P, A>(parts: OnlineParts<P, A>): Pick<OnlineHost, 'armScouted' | 'markCollected'> => ({
  armScouted(input) {
    const { run } = parts;
    if (run.armed !== null || run.applying) return run.grants;
    run.scouted = input;
    run.keysById = new Map(input.scouted.map((entry) => [entry.location, entry.locationKey]));
    run.entriesByKey = new Map(input.scouted.map((entry) => [entry.locationKey, entry]));
    run.grants = new Set();
    void armOnlineRun(parts);
    return run.grants;
  },
  markCollected(ids) {
    for (const id of ids) parts.run.collected.add(id);
    flushCollected(parts);
  },
});

export { hostScouted };
