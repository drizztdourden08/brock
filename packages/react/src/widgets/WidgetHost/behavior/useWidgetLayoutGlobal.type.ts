/* @layer renderer-shell @kind types */
import type { WIDGET_LAYOUT_GLOBAL } from '../../widget.constants';
import type { WidgetLayoutReading } from '../../widget.type';

type LayoutWindow = Window & Partial<Record<typeof WIDGET_LAYOUT_GLOBAL, () => WidgetLayoutReading>>;

export type { LayoutWindow };
