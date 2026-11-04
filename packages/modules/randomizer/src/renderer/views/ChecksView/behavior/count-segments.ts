/* @layer renderer-shell @kind logic */
import type { StackedBarSegment } from '@drizztdourden08/tessera/primitives';
import type { TrackerCounts } from '../../../../tracker';
import { STATUS_MAP, STATUS_ORDER } from '../ChecksView.constants';

const countSegments = (counts: TrackerCounts): StackedBarSegment[] =>
  STATUS_ORDER.map((status) => ({ id: status, label: STATUS_MAP[status].label, value: counts[status], color: STATUS_MAP[status].tone }));

export { countSegments };
