/* @layer electron-main @kind logic */
import { screen } from 'electron';
import { rescueWidgetWindows } from './rescue-widget-windows';
import { DISPLAY_SETTLE_MS } from './widget-windows.constants';

const watchDisplays = (): void => {
  let timer: ReturnType<typeof setTimeout> | null = null;
  const schedule = (): void => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      rescueWidgetWindows();
    }, DISPLAY_SETTLE_MS);
  };
  screen.on('display-added', schedule);
  screen.on('display-removed', schedule);
  screen.on('display-metrics-changed', schedule);
};

export { watchDisplays };
