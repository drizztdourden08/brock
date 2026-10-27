/* @layer renderer-shell @kind logic */
import type { Rect } from '@drizztdourden08/tessera/composites';
import { NO_WINDOW } from './widget-window-rect.constants';

const windowRect = (): Rect => (typeof window === 'undefined' ? NO_WINDOW : { x: 0, y: 0, width: window.innerWidth, height: window.innerHeight });

export { windowRect };
