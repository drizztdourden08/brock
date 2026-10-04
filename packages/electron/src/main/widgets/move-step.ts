/* @layer electron-main @kind logic */
import { detachWindow } from './detach-window';
import { modifierState } from './modifier-state';
import { moveSession } from './move-session';
import type { MoveSession } from './widget-windows.type';

const moveStep = (id: string): MoveSession => {
  const session = moveSession.begin(id);
  if (modifierState.ctrl && session.members.size > 1) {
    detachWindow(id);
    session.members = new Set([id]);
  }
  return session;
};

export { moveStep };
