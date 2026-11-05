/* @layer renderer-shell @kind types */
import type { LocationStatus, TrackerBadge, TrackerKind, TrackerProvider, TrackerReading } from '../../../../tracker';
import type { TrackerFeedInput } from '../../../tracker/feed/tracker-feed-state.type';
import type { FacetMode, KindFilter, StatusFilter } from '../ChecksView.type';

interface CheckRow {
  key: string;
  label: string;
  item: string | null;
  itemLabel: string | null;
  art: string | null;
  status: LocationStatus;
  marked: boolean;
  kind: TrackerKind;
  facets: readonly string[];
  badges: readonly TrackerBadge[];
  group: string;
  order: number;
}

interface RowsInput {
  provider: TrackerProvider<unknown>;
  reading: TrackerReading;
  feed: TrackerFeedInput;
  marks: ReadonlySet<string>;
  grouping: string;
}

interface RowGroup {
  label: string;
  order: number;
}

interface RowSubject {
  key: string;
  region: string;
  status: LocationStatus;
}

interface RowFilter {
  status: StatusFilter;
  kind: KindFilter;
  facets: readonly string[];
  facetMode: FacetMode;
  search: string;
}

export type { CheckRow, RowFilter, RowGroup, RowSubject, RowsInput };
