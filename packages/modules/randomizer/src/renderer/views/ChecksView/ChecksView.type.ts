/* @layer renderer-shell @kind types */
import type { LocationStatus, TrackerKind } from '../../../tracker';

type StatusFilter = LocationStatus | 'all';

type KindFilter = TrackerKind | 'all';

type FacetMode = 'any' | 'all';

type ViewMode = 'compact' | 'detailed' | 'visual';

interface ChecksPrefs {
  grouping: string;
  filter: StatusFilter;
  kind: KindFilter;
  facets: readonly string[];
  facetMode: FacetMode;
  assumed: readonly string[] | null;
  viewMode: ViewMode;
  expanded: readonly string[];
}

type PrefPair<T> = readonly [T, (next: T) => void];

type ChecksPrefState = { [Key in keyof ChecksPrefs]: PrefPair<ChecksPrefs[Key]> };

interface ChecksViewProps {
  prefKey?: string | null;
  initial?: Partial<ChecksPrefs> & { showItems?: boolean };
}

export type { ChecksPrefs, ChecksPrefState, ChecksViewProps, FacetMode, KindFilter, StatusFilter, ViewMode };
