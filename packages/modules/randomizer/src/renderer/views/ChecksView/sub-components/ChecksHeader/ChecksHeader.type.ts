/* @layer renderer-shell @kind types */
import type { TrackerCounts, TrackerProvider } from '../../../../../tracker';
import type { ChecksPrefState } from '../../ChecksView.type';

interface ChecksHeaderProps {
  provider: TrackerProvider<unknown>;
  counts: TrackerCounts;
  search: string;
  onSearch(value: string): void;
  prefs: ChecksPrefState;
  active: readonly string[];
}

export type { ChecksHeaderProps };
