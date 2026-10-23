/* @layer renderer-shell @kind logic */
import { confirmQuit } from './confirm-quit';

const requestQuit = async (quit: () => void): Promise<boolean> => {
  if (!(await confirmQuit())) return false;
  quit();
  return true;
};

export { requestQuit };
