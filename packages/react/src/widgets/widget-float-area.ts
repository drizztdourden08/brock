/* @layer renderer-shell @kind logic */
import type { Rect } from '@drizztdourden08/tessera/composites';
import { widgetMainRect } from './widget-main-rect';
import { windowRect } from './widget-window-rect';

const floatArea = (): Rect => widgetMainRect.current ?? windowRect();

export { floatArea };
