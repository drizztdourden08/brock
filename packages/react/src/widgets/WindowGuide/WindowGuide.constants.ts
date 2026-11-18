/* @layer renderer-shell @kind constants */
import { msg } from '@drizztdourden08/brock-core/i18n';
import type { WindowGuideMode, WindowGuideState } from '@drizztdourden08/brock-core';
import type { GuideHintDef } from './WindowGuide.type';

const GUIDE_HINTS: Readonly<Record<WindowGuideMode, readonly GuideHintDef[]>> = {
  moving: [
    { keys: [], label: msg('brock-app:guide.moving.together') },
    { keys: ['ctrl'], label: msg('brock-app:guide.moving.alone') },
  ],
  resizing: [
    { keys: [], label: msg('brock-app:guide.resizing.edges') },
    { keys: [], label: msg('brock-app:guide.resizing.aspect') },
    { keys: ['ctrl'], label: msg('brock-app:guide.resizing.alone') },
  ],
};

const CLOSED_GUIDE: WindowGuideState = { open: false, mode: 'moving', snapping: true };

export { CLOSED_GUIDE, GUIDE_HINTS };
