/* @layer electron-main @kind logic */
import { clusterMembers } from './cluster-members';
import type { ClusterMember } from './widget-windows.type';

let busy = false;

const once = (run: () => void): void => {
  if (busy) return;
  busy = true;
  try {
    run();
  } finally {
    busy = false;
  }
};

const hideMember = ({ win, entry }: ClusterMember): void => {
  if (win.isDestroyed() || win.isMinimized()) return;
  if (!entry || entry.taskbar) {
    win.minimize();
    return;
  }
  if (!win.isVisible()) return;
  entry.hiddenWithApp = true;
  win.hide();
};

const showMember = ({ win, entry }: ClusterMember): void => {
  if (win.isDestroyed()) return;
  if (win.isMinimized()) win.restore();
  if (!entry) {
    if (!win.isVisible()) win.show();
    return;
  }
  if (!entry.hiddenWithApp) return;
  entry.hiddenWithApp = false;
  if (!entry.parked) win.showInactive();
};

const others = (id: string, exceptId?: string): ClusterMember[] => clusterMembers(id).filter((member) => member.id !== exceptId);

const minimize = (id: string, exceptId?: string): void =>
  once(() => {
    for (const member of others(id, exceptId)) hideMember(member);
  });

const restore = (id: string, exceptId?: string): void =>
  once(() => {
    for (const member of others(id, exceptId)) showMember(member);
  });

const clusterVisibility = { minimize, restore };

export { clusterVisibility };
