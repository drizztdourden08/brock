/* @layer renderer-shell @kind constants */
import type { WindowGuideMode, WindowGuideState } from '@drizztdourden08/brock-core';
import type { WindowGuideHint } from '@drizztdourden08/tessera/composites';

const GUIDE_HINTS: Readonly<Record<WindowGuideMode, readonly WindowGuideHint[]>> = {
  moving: [
    { keys: [], label: 'Windows touching this one move together' },
    { keys: ['ctrl'], label: 'Move this window alone and unsnap it' },
  ],
  resizing: [
    { keys: [], label: 'Edges lined up with or touching this edge move with it' },
    { keys: [], label: 'An app with a locked aspect ratio keeps its shape and stays put' },
    { keys: ['ctrl'], label: 'Resize this window alone, without snapping' },
  ],
};

const CLOSED_GUIDE: WindowGuideState = { open: false, mode: 'moving', snapping: true };

export { CLOSED_GUIDE, GUIDE_HINTS };
