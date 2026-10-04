/* @layer renderer-shell @kind logic */
import { confirmAction } from '../stores/confirm-action';
import { QUIT_CONFIRM } from './quit.constants';
import { quitGuards } from './quit-guards';

const requestQuit = async (quit: () => void): Promise<boolean> => {
  const messages = quitGuards.messages();
  if (messages.length > 0 && !(await confirmAction({ ...QUIT_CONFIRM, message: messages.join('\n') }))) return false;
  quit();
  return true;
};

export { requestQuit };
