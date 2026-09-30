/* @layer electron-main @kind constants */
const SNAP_DISTANCE = 14;
const WIDGET_WINDOW_SIZE = { width: 360, height: 480 } as const;
const WIDGET_WINDOW_MIN = { width: 240, height: 160 } as const;
const WIDGET_WINDOW_OFFSET = 40;
const BOUNDS_DEBOUNCE_MS = 300;
const WIDGET_QUERY_KEY = 'widget';
const MAIN_ANCHOR = 'main';

export { BOUNDS_DEBOUNCE_MS, MAIN_ANCHOR, SNAP_DISTANCE, WIDGET_QUERY_KEY, WIDGET_WINDOW_MIN, WIDGET_WINDOW_OFFSET, WIDGET_WINDOW_SIZE };
