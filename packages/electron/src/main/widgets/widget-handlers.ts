/* @layer electron-main @kind logic */
import type { HandlerGroup } from '../types/main-context.type';
import { bootEvents } from '../boot/boot-events';
import { closeWidgetWindow } from './close-widget-window';
import { dropStaleGroupFile } from './drop-stale-group-file';
import { followMainWindow } from './follow-main-window';
import { holdQuitForBounds } from './hold-quit-for-bounds';
import { openWidgetWindow } from './open-widget-window';
import { relayToWidgetWindows } from './relay-to-widget-windows';
import { watchDisplays } from './watch-displays';
import { widgetRuntime } from './widget-runtime';
import { widgetMembership } from './widget-membership';
import { widgetWindowControl } from './widget-window-control';
import type { WidgetWindowSetup } from './widget-windows.type';

const widgetHandlers = (setup: WidgetWindowSetup): HandlerGroup => ({
  id: 'widgets',
  register: ({ handle, on, emit }) => {
    widgetRuntime.headless = setup.headless;
    bootEvents.on('window', followMainWindow);
    watchDisplays();
    holdQuitForBounds();
    dropStaleGroupFile();
    handle('widget:popOut', (_event, id, popped) => {
      openWidgetWindow(setup, id, popped);
    });
    handle('widget:listPopped', () => widgetWindowControl.list());
    handle('widget:setPin', (_event, id, mode) => widgetWindowControl.setPin(id, mode));
    handle('widget:getWindowState', (_event, id) => widgetWindowControl.stateOf(id));
    on('widget:dockBack', (_event, id, where) => closeWidgetWindow(id, where));
    on('widget:setSnap', (_event, id, value) => widgetWindowControl.setSnap(id, value));
    on('widget:setSync', (_event, id, value) => widgetMembership.setSync(id, value));
    on('widget:setFrame', (_event, id, patch) => emit('widget:frame', id, patch));
    on('widget:publish', (_event, slice) => relayToWidgetWindows(slice));
    on('widget:subscribe', (_event, id) => emit('widget:snapshotRequest', id));
    on('widget:setPrefs', (_event, id, prefs) => emit('widget:prefs', id, prefs));
    on('widget:patchSettings', (_event, patch) => emit('widget:settingsPatch', patch));
  },
});

export { widgetHandlers };
