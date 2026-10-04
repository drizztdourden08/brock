/* @layer electron-main @kind logic */
import { emit } from '../ipc/emit';
import { squareState } from './square-state';
import { tellWindow } from './tell-window';
import type { ClusterMember } from './widget-windows.type';

const squareMember = (member: ClusterMember, on: boolean): void => {
  if (member.win.isDestroyed()) return;
  if (!member.entry) {
    squareState.main = on;
    emit(member.win, 'widget:square', on);
    return;
  }
  member.entry.square = on;
  tellWindow(member.entry);
};

export { squareMember };
