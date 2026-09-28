/* @layer electron-main @kind logic */
import { fadeWindow } from './fade-window';
import { splashRef } from './splash-ref';

const closeSplash = (fadeMs: number): void => {
  const win = splashRef.current;
  splashRef.current = null;
  if (!win || win.isDestroyed()) return;
  fadeWindow(win, 0, fadeMs, () => {
    if (!win.isDestroyed()) win.destroy();
  });
};

export { closeSplash };
