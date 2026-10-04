/* @layer renderer-shell @kind constants */
import type { WindowGuideState } from '@drizztdourden08/brock-core';
import type { WindowGroup } from '@drizztdourden08/tessera/composites';

const WINDOW_GROUPS: readonly WindowGroup[] = [
  { id: '1', label: 'Group 1' },
  { id: '2', label: 'Group 2' },
  { id: '3', label: 'Group 3' },
  { id: '4', label: 'Group 4' },
];

const CLOSED_GUIDE: WindowGuideState = { open: false, mode: 'moving', snapping: true };

export { CLOSED_GUIDE, WINDOW_GROUPS };
