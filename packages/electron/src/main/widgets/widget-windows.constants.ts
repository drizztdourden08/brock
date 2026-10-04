/* @layer electron-main @kind constants */
import type { WidgetEdge } from '@drizztdourden08/brock-core';
import type { ResizeEdges } from './widget-windows.type';

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
const RESIZE_SIDES: readonly WidgetEdge[] = ['left', 'right', 'top', 'bottom'];
const VERTICAL_SIDES: readonly WidgetEdge[] = ['top', 'bottom'];
const ACROSS_SIDES: readonly WidgetEdge[] = ['left', 'right'];
const EMPTY_BOUNDS = { x: 0, y: 0, width: 0, height: 0 } as const;
const NO_SIDES: ResizeEdges = { left: false, right: false, top: false, bottom: false };
const AXIS_EDGE_PLATFORMS: readonly string[] = ['darwin'];
const PROBE_RESIZE_STEPS = 8;
const PROBE_BORDERS = { left: 6, top: 0, right: 6, bottom: 6 } as const;

export {
  ACROSS_SIDES, AXIS_EDGE_PLATFORMS, BACKDROP_COLOR, BOUNDS_DEBOUNCE_MS, COMPOSE_MARGIN, COMPOSE_MAX, COMPOSE_SHADE, CTRL_KEYS, CTRL_MODIFIERS, CURSOR_GRAB, DISPLAY_SETTLE_MS, DRAG_FADE_OPACITY, EMPTY_BOUNDS, FLUSH_TOLERANCE, FOCUS_AWAY_MS,
  GROUP_HOLD_MS, GUIDE_IDLE_MS, HEADLESS_AREA, KEY_RELEASES, MAIN_ANCHOR, MAIN_GROUP_FILE, MAIN_MIN_FALLBACK, NO_SIDES, OWNER_PLATFORMS, PROBE_BORDERS,
  PROBE_RESIZE_STEPS, PROBE_SETTLE_MS, QUIT_FLUSH_MS, REACH_MIN, RESIZE_SIDES,
  SIZE_TOLERANCE, SNAP_DISTANCE, TITLE_STRIP, TOW_MIN_OVERLAP, VERTICAL_SIDES, WIDGET_QUERY_KEY, WIDGET_WINDOW_MIN, WIDGET_WINDOW_OFFSET, WIDGET_WINDOW_SIZE,
};
