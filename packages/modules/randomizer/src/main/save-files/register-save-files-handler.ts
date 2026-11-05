/* @layer electron-main @kind logic */
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import { saveArchipelagoFiles } from './save-archipelago-files';

const registerSaveFilesHandler = ({ handle }: Pick<MainContext, 'handle'>): void => {
  handle('randomizer:archipelago:save-files', (_event, request) => saveArchipelagoFiles(request));
};

export { registerSaveFilesHandler };
