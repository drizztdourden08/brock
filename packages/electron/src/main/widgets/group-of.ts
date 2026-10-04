/* @layer electron-main @kind logic */
import type { WidgetWindowGroup } from '@drizztdourden08/brock-core';
import { mainGroup } from './main-group';
import { widgetWindowEntries } from './widget-window-entries';
import { MAIN_ANCHOR } from './widget-windows.constants';

const groupOf = (id: string): WidgetWindowGroup | null => (id === MAIN_ANCHOR ? mainGroup.get() : widgetWindowEntries.get(id)?.group ?? null);

export { groupOf };
