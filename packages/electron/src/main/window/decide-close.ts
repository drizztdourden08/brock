/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import type { QuitDecision } from '@drizztdourden08/brock-core/ipc';
import { askWithin } from '../ipc/ask-within';
import { CLOSE_ASK_TIMEOUT_MS, TIMED_OUT } from './decide-close.constants';

const decideClose = async (win: BrowserWindow): Promise<QuitDecision> => {
  try {
    return (await askWithin(CLOSE_ASK_TIMEOUT_MS, win, 'window:confirmQuit')) === 'stay' ? 'stay' : 'quit';
  } catch (error) {
    return TIMED_OUT.test(error instanceof Error ? error.message : String(error)) ? 'stay' : 'quit';
  }
};

export { decideClose };
