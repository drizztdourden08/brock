/* @layer renderer-shell @kind types */
import type { TrackerProvider } from '../../../../../tracker';
import type { ChecksPrefState } from '../../ChecksView.type';

interface ChecksFiltersProps {
  provider: TrackerProvider<unknown>;
  search: string;
  onSearch(value: string): void;
  prefs: ChecksPrefState;
}

export type { ChecksFiltersProps };
