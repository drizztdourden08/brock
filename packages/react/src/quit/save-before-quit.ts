/* @layer renderer-shell @kind logic */
import { getAppLog } from '../log/get-app-log';
import { confirmSave } from '../stores/confirm-save';
import { toast } from '../toast/toast';
import { QUIT_SAVE_FAILED } from './quit.constants';
import type { OnBeforeQuit, SaveBeforeQuitOptions } from './quit.type';
import { saveWording } from './save-wording';

const saved = async (save: SaveBeforeQuitOptions['save']): Promise<boolean> => {
  try {
    return (await save()) !== false;
  } catch (error) {
    getAppLog().error(`The save before quit failed: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
};

const saveBeforeQuit = (options: SaveBeforeQuitOptions): OnBeforeQuit => async () => {
  if (!options.dirty()) return 'quit';
  const answer = await confirmSave(saveWording(options));
  if (answer === 'cancel') return 'stay';
  if (answer === 'discard' || (await saved(options.save))) return 'quit';
  toast(QUIT_SAVE_FAILED, { variant: 'danger' });
  return 'stay';
};

export { saveBeforeQuit };
