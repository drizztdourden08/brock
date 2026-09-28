/* @layer electron-main @kind logic */
import { PENDING_CAP } from './main-log-file.constants';

const pending: string[] = [];

const mainLogBuffer = {
  isOpen: false,
  pending,
  hold: (line: string): void => {
    if (pending.length < PENDING_CAP) pending.push(line);
  },
};

export { mainLogBuffer };
