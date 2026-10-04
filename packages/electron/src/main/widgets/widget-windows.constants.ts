/* @layer electron-main @kind constants */
const SNAP_DISTANCE = 14;
const WIDGET_WINDOW_SIZE = { width: 360, height: 480 } as const;
const WIDGET_WINDOW_MIN = { width: 240, height: 160 } as const;
const WIDGET_WINDOW_OFFSET = 40;
const BOUNDS_DEBOUNCE_MS = 300;
const WIDGET_QUERY_KEY = 'widget';
const MAIN_ANCHOR = 'main';
const TOW_MIN_OVERLAP = 24;
const FLUSH_TOLERANCE = 1;
const SIZE_TOLERANCE = 1;
const TITLE_STRIP = 32;
const REACH_MIN = { width: 48, height: 16 } as const;
const CURSOR_GRAB = { x: 80, y: 16 } as const;
const DRAG_FADE_OPACITY = 0.45;
const HEADLESS_AREA = { width: 8000, height: 8000 } as const;
const DISPLAY_SETTLE_MS = 250;
const QUIT_FLUSH_MS = 150;
const PROBE_SETTLE_MS = 60;
const FOCUS_AWAY_MS = 300;
const GROUP_HOLD_MS = 400;
const GUIDE_IDLE_MS = 1500;
const COMPOSE_MAX = 1600;
const COMPOSE_MARGIN = 24;
const COMPOSE_SHADE = 40;
const BACKDROP_COLOR = '#000000';
const MAIN_GROUP_FILE = 'window-group.json';
const CTRL_KEYS: readonly string[] = ['Control', 'Ctrl'];
const CTRL_MODIFIERS: readonly string[] = ['control', 'ctrl'];
const KEY_RELEASES: readonly string[] = ['keyUp'];
const MAIN_MIN_FALLBACK = { width: 320, height: 240 } as const;
const OWNER_PLATFORMS: readonly string[] = ['win32'];

export {
  BACKDROP_COLOR, BOUNDS_DEBOUNCE_MS, COMPOSE_MARGIN, COMPOSE_MAX, COMPOSE_SHADE, CTRL_KEYS, CTRL_MODIFIERS, CURSOR_GRAB, DISPLAY_SETTLE_MS, DRAG_FADE_OPACITY, FLUSH_TOLERANCE, FOCUS_AWAY_MS,
  GROUP_HOLD_MS, GUIDE_IDLE_MS, HEADLESS_AREA, KEY_RELEASES, MAIN_ANCHOR, MAIN_GROUP_FILE, MAIN_MIN_FALLBACK, OWNER_PLATFORMS, PROBE_SETTLE_MS, QUIT_FLUSH_MS, REACH_MIN,
  SIZE_TOLERANCE, SNAP_DISTANCE, TITLE_STRIP, TOW_MIN_OVERLAP, WIDGET_QUERY_KEY, WIDGET_WINDOW_MIN, WIDGET_WINDOW_OFFSET, WIDGET_WINDOW_SIZE,
};
