/* @layer renderer-shell @kind logic */
import { createElement } from 'react';
import type { ReactNode } from 'react';
import { WidgetIdContext } from './widget-id-context';
import { WidgetPrefsPanel } from './WidgetPrefsPanel';
import type { WidgetDef } from './widget.type';

const widgetOptionsOf = (def: WidgetDef | undefined): ReactNode => {
  if (def === undefined || (def.settings === undefined && (def.prefs ?? []).length === 0)) return undefined;
  const own = def.prefs && def.prefs.length > 0 ? createElement(WidgetPrefsPanel, { def }) : null;
  return createElement(WidgetIdContext.Provider, { value: def.id }, own, def.settings?.());
};

export { widgetOptionsOf };
