/* @layer electron-main @kind logic */
import { screen } from 'electron';
import type { BrowserWindow, Display } from 'electron';

const placeOnDisplay = (win: BrowserWindow, display: Display): void => {
  if (screen.getDisplayMatching(win.getBounds()).id === display.id) return;
  const { workArea } = display;
  const { width, height } = win.getBounds();
  const fitWidth = Math.min(width, workArea.width);
  const fitHeight = Math.min(height, workArea.height);
  win.setBounds({
    x: workArea.x + Math.round((workArea.width - fitWidth) / 2),
    y: workArea.y + Math.round((workArea.height - fitHeight) / 2),
    width: fitWidth,
    height: fitHeight,
  });
};

export { placeOnDisplay };
