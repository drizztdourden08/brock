/* @layer electron-main @kind logic */
import type { WidgetDockBack } from '@drizztdourden08/brock-core';

const widgetWindowClosing = new Map<string, WidgetDockBack | undefined>();

export { widgetWindowClosing };
