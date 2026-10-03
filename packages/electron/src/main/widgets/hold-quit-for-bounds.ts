/* @layer electron-main @kind logic */
import { app } from 'electron';
import { flushWidgetBounds } from './flush-widget-bounds';
import { widgetRuntime } from './widget-runtime';
import { QUIT_FLUSH_MS } from './widget-windows.constants';

const holdQuitForBounds = (): void => {
  let held = false;
  app.on('before-quit', (event) => {
    widgetRuntime.quitting = true;
    if (!flushWidgetBounds() || held) return;
    held = true;
    event.preventDefault();
    setTimeout(() => app.quit(), QUIT_FLUSH_MS);
  });
};

export { holdQuitForBounds };
