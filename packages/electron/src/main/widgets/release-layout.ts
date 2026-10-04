/* @layer electron-main @kind logic */
import { setPinned } from '../window/set-pinned';
import { applyPin } from './apply-pin';
import { mainOnTop } from './main-on-top';
import { squareMember } from './square-member';
import type { ClusterLayout, ClusterMember } from './widget-windows.type';

const live = (member: ClusterMember): boolean => !member.win.isDestroyed();

const unsquare = (layout: ClusterLayout, members: readonly ClusterMember[]): void => {
  for (const member of members.filter(live)) {
    squareMember(member, false);
    if (!member.entry) setPinned(member.win, layout.onTop.get(member.id) === true);
  }
  for (const member of members.filter(live)) if (member.entry) applyPin(member.entry, mainOnTop());
};

const releaseLayout = (layout: ClusterLayout, members: readonly ClusterMember[]): void => {
  layout.release?.();
  if (layout.backdrop && !layout.backdrop.isDestroyed()) layout.backdrop.destroy();
  if (layout.mode === 'fullscreen') unsquare(layout, members);
};

export { releaseLayout };
