/* @layer renderer-shell @kind types */
import type { TrackerProvider } from '../../../../../tracker';
import type { ChecksPrefState } from '../../ChecksView.type';

interface FacetPanelProps {
  provider: TrackerProvider<unknown>;
  prefs: ChecksPrefState;
}

export type { FacetPanelProps };
