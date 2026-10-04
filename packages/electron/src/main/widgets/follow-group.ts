/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import { activeGroup } from './active-group';
import { groupLayout } from './group-layout';
import { groupVisibility } from './group-visibility';

const followGroup = (id: string, win: BrowserWindow): void => {
  win.on('maximize', () => {
    const group = activeGroup(id);
    if (group === null) return;
    setImmediate(() => {
      if (!win.isDestroyed() && win.isMaximized()) win.unmaximize();
      groupLayout.toggle(group, 'maximized');
    });
  });
  win.on('minimize', () => {
    const group = activeGroup(id);
    if (group !== null) groupVisibility.minimize(group, id);
  });
  win.on('restore', () => {
    const group = activeGroup(id);
    if (group !== null) groupVisibility.restore(group, id);
  });
};

export { followGroup };
