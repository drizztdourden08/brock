/* @layer electron-main @kind logic */
import type { MainContext } from '../types/main-context.type';
import type { DocumentTracking } from './document-tracking.type';
import { profileIdOf } from './profile-id-of';

const registerRecentHandlers = ({ handle }: Pick<MainContext, 'handle'>, { recent }: DocumentTracking): void => {
  handle('document:recent', (_event, profileId) => recent.list(profileIdOf(profileId)));
  handle('document:clearRecent', (_event, profileId) => recent.clear(profileIdOf(profileId)));
  handle('document:openRecent', (_event, profileId, path) => {
    if (typeof path !== 'string') throw new Error('A recent document is opened by its path');
    return recent.reopen(profileIdOf(profileId), path);
  });
};

export { registerRecentHandlers };
