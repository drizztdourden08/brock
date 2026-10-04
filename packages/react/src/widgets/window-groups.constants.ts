/* @layer renderer-shell @kind constants */
import type { WindowGuideState } from '@drizztdourden08/brock-core';
import type { WindowGuideHint, WindowGroupOption } from './widget.type';

const WINDOW_GROUPS: readonly WindowGroupOption[] = [
  { id: '1', label: 'Group 1' },
  { id: '2', label: 'Group 2' },
  { id: '3', label: 'Group 3' },
  { id: '4', label: 'Group 4' },
];

const NO_GROUP = 'none';
const CLOSED_GUIDE: WindowGuideState = { open: false, mode: 'moving', snapping: true };
const WINDOW_GROUP_ACTION_ID = 'window-group';

const WINDOW_GROUP_TEXT = {
  group: 'Window group',
  none: 'None',
  sync: 'Sync with main window',
  syncHint: 'Shows, hides, minimizes and raises with the main window',
  moving: 'Moving a window',
  resizing: 'Resizing a window',
  snapOn: 'Snapping on',
  snapOff: 'Snapping off',
} as const;

const WINDOW_GUIDE_HINTS: readonly WindowGuideHint[] = [
  { keys: ['ctrl'], text: 'Hold Ctrl to skip snapping' },
  { keys: ['ctrl'], text: 'Hold Ctrl while resizing to resize only this window' },
  { text: 'Edges and corners snap to the windows around, so they line up into a grid' },
  { text: 'An edge shared by snapped windows resizes them all together' },
  { text: 'Windows in the same group maximize, go full screen, minimize, restore and close together' },
];

export { CLOSED_GUIDE, NO_GROUP, WINDOW_GROUP_ACTION_ID, WINDOW_GROUP_TEXT, WINDOW_GROUPS, WINDOW_GUIDE_HINTS };
