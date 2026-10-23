/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import { closeApproval } from './close-approval';
import { decideClose } from './decide-close';

const holdClose = (win: BrowserWindow): void => {
  let asking = false;
  win.on('close', (event) => {
    if (closeApproval.take(win)) return;
    event.preventDefault();
    if (asking) return;
    asking = true;
    void decideClose(win).then((decision) => {
      asking = false;
      if (decision === 'stay' || win.isDestroyed()) return;
      closeApproval.grant(win);
      win.close();
    });
  });
};

export { holdClose };
