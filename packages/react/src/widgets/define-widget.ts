/* @layer renderer-shell @kind logic */
import { CONTEXT_DEFAULTS, WIDGET_DEFAULTS } from './widget.constants';
import type { WidgetDef, WidgetInput } from './widget.type';

const defineWidget = (input: WidgetInput): WidgetDef => ({ ...WIDGET_DEFAULTS, ...(input.context ? CONTEXT_DEFAULTS : {}), ...input });

export { defineWidget };
