/* @layer electron-main @kind logic */
import type { WidgetDockBack, WidgetWindowGroup } from '@drizztdourden08/brock-core';
import { closeWidgetWindow } from './close-widget-window';
import { groupMembers } from './group-members';
import type { GroupMember } from './widget-windows.type';

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

const hideMember = ({ win, entry }: GroupMember): void => {
  if (win.isDestroyed() || win.isMinimized()) return;
  if (!entry || entry.taskbar) {
    win.minimize();
    return;
  }
  if (!win.isVisible()) return;
  entry.hiddenWithApp = true;
  win.hide();
};

const showMember = ({ win, entry }: GroupMember): void => {
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

const minimize = (group: WidgetWindowGroup, exceptId?: string): void =>
  once(() => {
    for (const member of groupMembers(group)) if (member.id !== exceptId) hideMember(member);
  });

const restore = (group: WidgetWindowGroup, exceptId?: string): void =>
  once(() => {
    for (const member of groupMembers(group)) if (member.id !== exceptId) showMember(member);
  });

const close = (group: WidgetWindowGroup, where: WidgetDockBack | undefined, exceptId: string): void =>
  once(() => {
    for (const member of groupMembers(group)) if (member.entry && member.id !== exceptId) closeWidgetWindow(member.id, where);
  });

const groupVisibility = { minimize, restore, close };

export { groupVisibility };
