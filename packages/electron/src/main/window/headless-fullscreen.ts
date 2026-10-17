/* @layer electron-main @kind logic */
import type { Rectangle } from 'electron';
import { layoutAreas } from '../widgets/layout-areas';
import { widgetRuntime } from '../widgets/widget-runtime';
import type { FullscreenTarget } from './headless-fullscreen.type';

const saved = new WeakMap<FullscreenTarget, Rectangle>();

const setHeadlessFullscreen = (win: FullscreenTarget, on: boolean, tell: (on: boolean) => void): void => {
  if (on === saved.has(win)) return;
  if (on) {
    saved.set(win, win.getBounds());
    const [area] = layoutAreas(true);
    if (area) win.setBounds(area);
  } else {
    const bounds = saved.get(win);
    saved.delete(win);
    if (bounds) win.setBounds(bounds);
  }
  tell(on);
};

const headlessFullscreen = {
  applies: (): boolean => widgetRuntime.headless,
  set: setHeadlessFullscreen,
  is: (win: FullscreenTarget): boolean => saved.has(win),
};

export { headlessFullscreen };
