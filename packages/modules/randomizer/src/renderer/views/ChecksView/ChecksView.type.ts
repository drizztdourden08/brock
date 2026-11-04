/* @layer renderer-shell @kind types */
import type { LocationStatus } from '../../../tracker';

type StatusFilter = LocationStatus | 'all';

interface ChecksPrefs {
  grouping: string;
  filter: StatusFilter;
  assumed: readonly string[] | null;
  showItems: boolean;
  expanded: readonly string[];
}

type PrefPair<T> = readonly [T, (next: T) => void];

type ChecksPrefState = { [Key in keyof ChecksPrefs]: PrefPair<ChecksPrefs[Key]> };

interface ChecksViewProps {
  prefKey?: string | null;
  initial?: Partial<ChecksPrefs>;
}

export type { ChecksPrefs, ChecksPrefState, ChecksViewProps, StatusFilter };
