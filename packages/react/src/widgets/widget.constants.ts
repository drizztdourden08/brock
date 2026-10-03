/* @layer renderer-shell @kind constants */
import type { WidgetDef } from './widget.type';

const WIDGET_DEFAULTS: Omit<WidgetDef, 'id' | 'label' | 'render'> = {
  defaultVisibility: 'always',
  defaultSide: 'right',
  defaultDockedSize: 320,
  defaultFloatingSize: { width: 480, height: 320 },
};

const PROFILE_VIEWS_PREFIX = 'profile:';
const VIEWS_SAVE_DELAY_MS = 250;
const NO_WIDGETS: readonly WidgetDef[] = [];
const NO_IDS: readonly string[] = [];
const WIDGET_KEY_PREFIX = 'widget-';
const WIDGET_QUERY_KEY = 'widget';
const RELAY_DELAY_MS = 200;
const RELAY_LOG_LIMIT = 1000;
const RELEASE_TIMEOUT_MS = 1500;
const DRAG_SLOP_PX = 6;

const RELAY_SLICES = { log: 'log', logAppend: 'log+', frames: 'frames', prefs: 'prefs', settings: 'settings' } as const;

export {
  DRAG_SLOP_PX, NO_IDS, NO_WIDGETS, PROFILE_VIEWS_PREFIX, RELAY_DELAY_MS, RELAY_LOG_LIMIT, RELAY_SLICES, RELEASE_TIMEOUT_MS, VIEWS_SAVE_DELAY_MS, WIDGET_DEFAULTS, WIDGET_KEY_PREFIX,
  WIDGET_QUERY_KEY,
};
