/* @layer renderer-shell @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { WidgetDef } from './widget.type';

const widgetLabelOf = (def: Pick<WidgetDef, 'label' | 'labelText'>): Text => def.labelText ?? def.label;

export { widgetLabelOf };
