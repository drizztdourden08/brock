/* @layer core @kind logic */
import type { OnlineParts } from './online-parts.type';

const beginPolling = <P, A>(parts: OnlineParts<P, A>): void => {
  const { ap, run, poller, late, report } = parts;
  const entries = [...(run.armed?.polled ?? []), ...(ap.goal === undefined ? [] : [ap.goal])];
  run.pollWanted = false;
  poller.start(entries, {
    report,
    isKnownReported: (key) => {
      const id = ap.locationIdOf(key);
      return id !== null && late.client().checkedLocations().has(id);
    },
  });
};

export { beginPolling };
