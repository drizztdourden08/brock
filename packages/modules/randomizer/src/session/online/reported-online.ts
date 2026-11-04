/* @layer core @kind logic */
import type { OnlineParts } from './online-parts.type';

const reportedOnline = <P, A>({ run, poller, late }: OnlineParts<P, A>): ReadonlySet<string> => {
  const all = run.reportedAll;
  for (const key of poller.reported()) all.add(key);
  for (const id of late.client().checkedLocations()) {
    const key = run.keysById.get(id);
    if (key !== undefined) all.add(key);
  }
  return all;
};

export { reportedOnline };
