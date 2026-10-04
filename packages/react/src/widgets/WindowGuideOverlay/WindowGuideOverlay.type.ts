/* @layer renderer-shell @kind types */
import type { WindowGuideMode } from '@drizztdourden08/brock-core';
import type { WindowGuideHint } from '../widget.type';

interface WindowGuideOverlayProps {
  open: boolean;
  mode: WindowGuideMode;
  snapping: boolean;
  hints?: readonly WindowGuideHint[];
}

export type { WindowGuideOverlayProps };
