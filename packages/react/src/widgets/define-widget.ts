/* @layer renderer-shell @kind logic */
import { WIDGET_DEFAULTS } from './widget.constants';
import type { WidgetDef, WidgetInput } from './widget.type';

const defineWidget = (input: WidgetInput): WidgetDef => ({ ...WIDGET_DEFAULTS, ...input });

export { defineWidget };
