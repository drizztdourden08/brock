/* @layer electron-main @kind logic */
import { emit } from '../ipc/emit';
import { windowStateOf } from './window-state-of';
import type { WidgetWindowEntry } from './widget-windows.type';

const tellWindow = (entry: WidgetWindowEntry): void => emit(entry.win, 'widget:windowState', windowStateOf(entry));

export { tellWindow };
