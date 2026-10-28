/* @layer renderer-shell @kind logic */
import { DEFAULT_CONTEXT } from '../contexts/contexts.constants';
import type { WidgetDef } from './widget.type';

const widgetContextsOf = (def: Pick<WidgetDef, 'context' | 'contexts'>): readonly string[] => def.contexts ?? [def.context ?? DEFAULT_CONTEXT];

export { widgetContextsOf };
