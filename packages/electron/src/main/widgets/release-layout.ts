/* @layer electron-main @kind logic */
import { setPinned } from '../window/set-pinned';
import { applyPin } from './apply-pin';
import { mainOnTop } from './main-on-top';
import { squareMember } from './square-member';
import type { GroupLayout, GroupMember } from './widget-windows.type';

const live = (member: GroupMember): boolean => !member.win.isDestroyed();

const unsquare = (layout: GroupLayout, members: readonly GroupMember[]): void => {
  for (const member of members.filter(live)) {
    squareMember(member, false);
    if (!member.entry) setPinned(member.win, layout.onTop.get(member.id) === true);
  }
  for (const member of members.filter(live)) if (member.entry) applyPin(member.entry, mainOnTop());
};

const releaseLayout = (layout: GroupLayout, members: readonly GroupMember[]): void => {
  layout.release?.();
  if (layout.backdrop && !layout.backdrop.isDestroyed()) layout.backdrop.destroy();
  if (layout.mode === 'fullscreen') unsquare(layout, members);
};

export { releaseLayout };
