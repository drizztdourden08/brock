/* @layer renderer-shell @kind logic */
import { GAP } from '@drizztdourden08/tessera/composites';
import type { Rect } from '@drizztdourden08/tessera/composites';
import { windowRect } from './widget-window-rect';
import { DOCK_STAGE_SELECTOR } from './widget.constants';

const stageRect = (): Rect => {
  const found = typeof document === 'undefined' ? undefined : document.querySelector(DOCK_STAGE_SELECTOR)?.getBoundingClientRect();
  const stage = found && found.width > 0 && found.height > 0 ? found : windowRect();
  return { x: GAP, y: GAP, width: Math.max(0, stage.width - GAP * 2), height: Math.max(0, stage.height - GAP * 2) };
};

export { stageRect };
