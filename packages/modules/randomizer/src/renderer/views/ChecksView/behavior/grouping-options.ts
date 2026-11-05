/* @layer renderer-shell @kind logic */
import type { SegmentOption } from '@drizztdourden08/tessera/primitives';
import type { TrackerProvider } from '../../../../tracker';
import { BASE_GROUPINGS } from '../ChecksView.constants';

const groupingOptions = (provider: TrackerProvider<unknown>): SegmentOption[] => {
  const base = Object.keys(BASE_GROUPINGS).filter((id) => id !== 'sphere' || provider.sphereOf !== undefined);
  return [
    ...base.map((id) => ({ value: id, label: BASE_GROUPINGS[id] })),
    ...(provider.groupings ?? []).map((grouping) => ({ value: grouping.id, label: grouping.label, title: grouping.description })),
  ];
};

export { groupingOptions };
