/* @layer renderer-shell @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { SegmentOption } from '@drizztdourden08/tessera/primitives';
import type { TrackerProvider } from '../../../../tracker';
import { BASE_GROUPINGS } from '../ChecksView.constants';

const groupingOptions = (provider: TrackerProvider<unknown>, text: (value: Text) => string): SegmentOption[] => {
  const base = Object.keys(BASE_GROUPINGS).filter((id) => id !== 'sphere' || provider.sphereOf !== undefined);
  return [
    ...base.map((id) => ({ value: id, label: text(BASE_GROUPINGS[id]) })),
    ...(provider.groupings ?? []).map((grouping) => ({ value: grouping.id, label: text(grouping.label), ...(grouping.description === undefined ? {} : { title: text(grouping.description) }) })),
  ];
};

export { groupingOptions };
