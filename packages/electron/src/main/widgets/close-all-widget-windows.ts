/* @layer electron-main @kind logic */
import { liveEntries } from './live-entries';

const closeAllWidgetWindows = (): void => {
  for (const [, entry] of liveEntries()) entry.win.close();
};

export { closeAllWidgetWindows };
