/* @layer renderer-shell @kind logic */
import type { WidgetKitDef } from './widget-kit.type';

const defineWidgetKit = (input: WidgetKitDef): WidgetKitDef => ({ ...input });

export { defineWidgetKit };
