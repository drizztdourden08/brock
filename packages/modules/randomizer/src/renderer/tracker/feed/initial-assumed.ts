/* @layer renderer-shell @kind logic */
import type { TrackerProvider } from '../../../tracker';

const initialAssumed = (provider: TrackerProvider<unknown>): ReadonlySet<string> =>
  new Set((provider.assumptions ?? []).filter((assumption) => assumption.initial).map((assumption) => assumption.id));

export { initialAssumed };
