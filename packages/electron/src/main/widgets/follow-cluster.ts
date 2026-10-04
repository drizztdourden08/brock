/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import { activeCluster } from './active-cluster';
import { clusterLayout } from './cluster-layout';
import { clusterVisibility } from './cluster-visibility';

const followCluster = (id: string, win: BrowserWindow): void => {
  win.on('maximize', () => {
    if (!activeCluster(id)) return;
    setImmediate(() => {
      if (!win.isDestroyed() && win.isMaximized()) win.unmaximize();
      clusterLayout.toggle(id, 'maximized');
    });
  });
  win.on('minimize', () => {
    if (activeCluster(id)) clusterVisibility.minimize(id, id);
  });
  win.on('restore', () => {
    if (activeCluster(id)) clusterVisibility.restore(id, id);
  });
};

export { followCluster };
