/* @layer electron-main @kind logic */
import { linkedTo } from './linked-to';
import { liveEntries } from './live-entries';
import { widgetWindowEntries } from './widget-window-entries';
import { MAIN_ANCHOR } from './widget-windows.constants';
import type { WidgetWindowEntry } from './widget-windows.type';

const showIfFree = (entry: WidgetWindowEntry): void => {
  if (!entry.parked && !entry.hiddenWithApp && !entry.win.isDestroyed()) entry.win.showInactive();
};

const followers = (): WidgetWindowEntry[] =>
  liveEntries().map(([, entry]) => entry).filter((entry) => entry.sync || entry.pin === 'with-app').sort((a, b) => a.zStamp - b.zStamp);

const hideWithApp = (): void => {
  for (const entry of followers()) {
    if (entry.hiddenWithApp || !entry.win.isVisible()) continue;
    entry.hiddenWithApp = true;
    entry.win.hide();
  }
};

const showWithApp = (): void => {
  for (const [, entry] of liveEntries()) {
    if (!entry.hiddenWithApp) continue;
    entry.hiddenWithApp = false;
    showIfFree(entry);
  }
};

const raiseWithApp = (): void => {
  for (const entry of followers()) if (entry.win.isVisible()) entry.win.moveTop();
};

const park = (): void => {
  for (const id of linkedTo(MAIN_ANCHOR)) {
    const entry = widgetWindowEntries.get(id);
    if (!entry || entry.parked || entry.win.isDestroyed()) continue;
    entry.parked = true;
    entry.win.hide();
  }
};

const unpark = (): void => {
  for (const [, entry] of liveEntries()) {
    if (!entry.parked) continue;
    entry.parked = false;
    showIfFree(entry);
  }
};

const widgetVisibility = { hideWithApp, showWithApp, raiseWithApp, park, unpark };

export { widgetVisibility };
