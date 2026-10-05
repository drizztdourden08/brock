/* @layer renderer-shell @kind constants */
import type { Size } from '@drizztdourden08/tessera/composites';
import type { MenuItem } from '../menu/menu.type';
import type { WidgetDef } from './widget.type';

const WIDGET_DEFAULTS: Omit<WidgetDef, 'id' | 'label' | 'render'> = {
  defaultVisibility: 'always',
  defaultSide: 'right',
  defaultDockedSize: 320,
  defaultFloatingSize: { width: 480, height: 320 },
};

const CONTEXT_DEFAULTS: Pick<WidgetDef, 'defaultVisibility'> = { defaultVisibility: 'context-only' };

const PROFILE_VIEWS_PREFIX = 'profile:';
const VIEWS_SAVE_DELAY_MS = 250;
const FLUSH_EVENTS = ['beforeunload', 'pagehide'] as const;
const NO_WIDGETS: readonly WidgetDef[] = [];
const NO_IDS: readonly string[] = [];
const WIDGET_KEY_PREFIX = 'widget-';
const WIDGET_QUERY_KEY = 'widget';
const RELAY_DELAY_MS = 200;
const RELAY_LOG_LIMIT = 1000;
const RELEASE_TIMEOUT_MS = 1500;
const DRAG_SLOP_PX = 6;
const FLOATING_MIN: Size = { width: 240, height: 160 };

const RELAY_SLICES = { log: 'log', logAppend: 'log+', frames: 'frames', prefs: 'prefs', settings: 'settings', contexts: 'contexts' } as const;
const REVIEW_OPTIONS_SLICE = 'review-options';
const WIDGET_LAYOUT_GLOBAL = '__brockWidgetLayout';
const DRAWN_WIDGET_SELECTOR = '[data-widget-id]';
const LAYOUT_MAIN = 'main';
const RESET_LAYOUT_ENTRY: Omit<MenuItem, 'onClick'> = { key: 'widgets-reset-layout', label: 'Reset layout', icon: 'rotate-ccw', confirm: 'Click again to reset' };

export {
  CONTEXT_DEFAULTS, DRAG_SLOP_PX, DRAWN_WIDGET_SELECTOR, FLOATING_MIN, FLUSH_EVENTS, LAYOUT_MAIN, NO_IDS, NO_WIDGETS, PROFILE_VIEWS_PREFIX, RELAY_DELAY_MS, RELAY_LOG_LIMIT, RELAY_SLICES, RELEASE_TIMEOUT_MS, RESET_LAYOUT_ENTRY, REVIEW_OPTIONS_SLICE, VIEWS_SAVE_DELAY_MS, WIDGET_DEFAULTS, WIDGET_KEY_PREFIX,
  WIDGET_LAYOUT_GLOBAL, WIDGET_QUERY_KEY,
};
