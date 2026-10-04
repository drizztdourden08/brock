/* @layer renderer-shell @kind constants */
import LogsWidget, { meta as logsMeta } from './built-in/logs.widget';
import { LOGS_WIDGET_ID } from './built-in/LogsWidget/LogsWidget.constants';
import type { WidgetDef } from './widget.type';
import { widgetsFromFiles } from './widgets-from-files';

const BUILT_IN_WIDGETS: readonly WidgetDef[] = widgetsFromFiles([
  { id: LOGS_WIDGET_ID, component: LogsWidget, meta: logsMeta },
]);

export { BUILT_IN_WIDGETS };
