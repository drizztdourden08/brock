/* @layer renderer-shell @kind types */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { WidgetDef } from '@drizztdourden08/brock-react';

type WidgetSlot = Pick<WidgetDef, 'context' | 'order' | 'padding' | 'icon' | 'popOut'> & { label?: Text };

export type { WidgetSlot };
