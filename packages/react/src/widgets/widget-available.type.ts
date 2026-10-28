/* @layer renderer-shell @kind types */
import type { WidgetDef } from './widget.type';

type WidgetRuleParts = Pick<WidgetDef, 'context' | 'contexts' | 'when'>;

export type { WidgetRuleParts };
