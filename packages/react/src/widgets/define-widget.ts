/* @layer renderer-shell @kind logic */
import { fallbackText } from '../i18n/fallback-text';
import { CONTEXT_DEFAULTS, WIDGET_DEFAULTS } from './widget.constants';
import type { WidgetDef, WidgetInput } from './widget.type';

const defineWidget = (input: WidgetInput): WidgetDef => {
  const { label, ...rest } = input;
  return { ...WIDGET_DEFAULTS, ...(input.context || input.contexts || input.when ? CONTEXT_DEFAULTS : {}), ...rest, label: fallbackText(label), labelText: label };
};

export { defineWidget };
