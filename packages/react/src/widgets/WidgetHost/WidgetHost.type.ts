/* @layer renderer-shell @kind types */
import type { WidgetDef } from '../widget.type';

interface WidgetHostProps {
  widgets?: readonly WidgetDef[];
}

export type { WidgetHostProps };
