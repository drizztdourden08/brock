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
const WIDGET_TOP_OFFSET = 40;
const NO_WIDGETS: readonly WidgetDef[] = [];
const WIDGET_KEY_PREFIX = 'widget-';

export { NO_WIDGETS, PROFILE_VIEWS_PREFIX, VIEWS_SAVE_DELAY_MS, WIDGET_DEFAULTS, WIDGET_KEY_PREFIX, WIDGET_TOP_OFFSET };
