/* @layer renderer-shell @kind constants */
import { createElement } from 'react';
import { defineWidget } from './define-widget';
import { LogsWidget } from './LogsWidget/LogsWidget';
import { LOGS_WIDGET_ID } from './LogsWidget/LogsWidget.constants';
import type { WidgetDef } from './widget.type';

const BUILT_IN_WIDGETS: readonly WidgetDef[] = [
  defineWidget({
    id: LOGS_WIDGET_ID,
    label: 'Logs',
    render: () => createElement(LogsWidget),
    defaultSide: 'bottom',
    defaultDockedSize: 240,
    defaultFloatingSize: { width: 640, height: 360 },
  }),
];

export { BUILT_IN_WIDGETS };
