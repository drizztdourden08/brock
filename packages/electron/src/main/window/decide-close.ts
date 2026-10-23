/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import type { QuitDecision } from '@drizztdourden08/brock-core/ipc';
import { askWithin } from '../ipc/ask-within';
import { CLOSE_PING_TIMEOUT_MS, CLOSE_WAIT_FOR_USER_MS } from './decide-close.constants';

const decideClose = async (win: BrowserWindow): Promise<QuitDecision> => {
  try {
    await askWithin(CLOSE_PING_TIMEOUT_MS, win, 'window:pingQuit');
    return (await askWithin(CLOSE_WAIT_FOR_USER_MS, win, 'window:confirmQuit')) === 'stay' ? 'stay' : 'quit';
  } catch {
    return 'quit';
  }
};

export { decideClose };
