/* @layer renderer-shell @kind types */
import type { LocationStatus, TrackerProvider, TrackerReading } from '../../../../tracker';
import type { TrackerFeedInput } from '../../../tracker/feed/tracker-feed-state.type';
import type { StatusFilter } from '../ChecksView.type';

interface CheckRow {
  key: string;
  label: string;
  item: string | null;
  status: LocationStatus;
  marked: boolean;
  group: string;
  order: number;
}

interface RowsInput {
  provider: TrackerProvider<unknown>;
  reading: TrackerReading;
  feed: TrackerFeedInput;
  marks: ReadonlySet<string>;
  grouping: string;
  showItems: boolean;
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
  filter: StatusFilter;
  search: string;
}

export type { CheckRow, RowFilter, RowGroup, RowSubject, RowsInput };
