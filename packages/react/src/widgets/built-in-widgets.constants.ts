/* @layer renderer-shell @kind constants */
import LogsWidget, { meta as logsMeta } from './built-in/logs.widget';
import PerformanceWidget, { meta as performanceMeta } from './built-in/performance.widget';
import { LOGS_WIDGET_ID } from './built-in/LogsWidget/LogsWidget.constants';
import { PERFORMANCE_WIDGET_ID } from './built-in/PerformanceWidget/PerformanceWidget.constants';
import type { WidgetDef } from './widget.type';
import { widgetsFromFiles } from './widgets-from-files';

const BUILT_IN_WIDGETS: readonly WidgetDef[] = widgetsFromFiles([
  { id: LOGS_WIDGET_ID, component: LogsWidget, meta: logsMeta },
  { id: PERFORMANCE_WIDGET_ID, component: PerformanceWidget, meta: performanceMeta },
]);

export { BUILT_IN_WIDGETS };
