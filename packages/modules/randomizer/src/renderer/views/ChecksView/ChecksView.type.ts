/* @layer renderer-shell @kind types */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { StatusMap } from '@drizztdourden08/tessera/primitives';
import type { LocationStatus, TrackerKind } from '../../../tracker';

type StatusFilter = LocationStatus | 'all';

type KindFilter = TrackerKind | 'all';

type FacetMode = 'any' | 'all';

type ViewMode = 'compact' | 'detailed' | 'visual';

interface ChecksOption<V extends string> {
  value: V;
  label: Text;
  title?: Text;
}

type StatusDef = Omit<StatusMap<LocationStatus>[LocationStatus], 'label'> & { label: Text };

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

export type { ChecksOption, ChecksPrefs, ChecksPrefState, ChecksViewProps, FacetMode, KindFilter, StatusDef, StatusFilter, ViewMode };
