/* @layer renderer-shell @kind constants */
import type { WidgetWindowState } from '@drizztdourden08/brock-core';

const INITIAL_WINDOW_STATE: WidgetWindowState = { pin: 'off', onTop: false, snap: true, link: null, sync: true, square: false };

const DRAG_STRIP_SELECTOR = '[data-drag-widget]';

export { DRAG_STRIP_SELECTOR, INITIAL_WINDOW_STATE };
