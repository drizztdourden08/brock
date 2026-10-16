/* @layer renderer-shell @kind logic */
import { createElement } from 'react';
import type { ReactNode } from 'react';
import { WidgetIdContext } from './widget-id-context';
import type { WidgetDef } from './widget.type';

const widgetToolsOf = (definition: WidgetDef | undefined): ReactNode =>
  (definition?.tools ? createElement(WidgetIdContext.Provider, { value: definition.id }, definition.tools()) : undefined);

export { widgetToolsOf };
