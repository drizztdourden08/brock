/* @layer electron-main @kind logic */
import type { MainContext } from '../types/main-context.type';
import type { DocumentTracking } from './document-tracking.type';

const registerRecentHandlers = ({ handle }: Pick<MainContext, 'handle'>, { recent, profile }: DocumentTracking): void => {
  handle('document:recent', async (_event, profileId) => recent.list(await profile(profileId)));
  handle('document:clearRecent', async (_event, profileId) => recent.clear(await profile(profileId)));
  handle('document:openRecent', async (_event, profileId, path) => {
    if (typeof path !== 'string') throw new Error('A recent document is opened by its path');
    return recent.reopen(await profile(profileId), path);
  });
};

export { registerRecentHandlers };
