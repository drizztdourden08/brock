/* @layer renderer-shell @kind types */
import type { WidgetDef } from '@drizztdourden08/brock-react';

type WidgetSlot = Pick<WidgetDef, 'context' | 'order' | 'padding' | 'icon' | 'popOut'>;

export type { WidgetSlot };
