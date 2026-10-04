/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import type { GroupMember } from './widget-windows.type';

const live = (win: BrowserWindow): boolean => !win.isDestroyed();

const holdFront = (members: readonly GroupMember[], backdrop: BrowserWindow): (() => void) => {
  const windows = [backdrop, ...members.map((member) => member.win)];
  const front = (on: boolean): void => {
    for (const win of windows.filter(live)) win.setAlwaysOnTop(on, 'screen-saver');
    if (on) for (const win of windows.filter(live)) win.moveTop();
  };
  const onFocus = (): void => front(true);
  const onBlur = (): void => {
    setImmediate(() => {
      if (!members.some((member) => live(member.win) && member.win.isFocused())) front(false);
    });
  };
  for (const member of members) {
    member.win.on('focus', onFocus);
    member.win.on('blur', onBlur);
  }
  front(true);
  return () => {
    for (const member of members.filter((m) => live(m.win))) {
      member.win.off('focus', onFocus);
      member.win.off('blur', onBlur);
    }
  };
};

export { holdFront };
