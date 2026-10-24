/* @layer electron-main @kind logic */
import type { MainContext } from '../types/main-context.type';
import type { RememberedFolders } from './remembered-folders.type';
import { trackingOf } from './tracking-of';

const mainFolderMemory = (ctx: Pick<MainContext, 'paths' | 'documents' | 'log' | 'profiles'>): RememberedFolders => {
  const { folders, profile } = trackingOf(ctx);
  return {
    list: async (profileId) => folders.list(await profile(profileId)),
    find: async (profileId, path) => folders.find(await profile(profileId), path),
    remember: async (profileId, real) => folders.remember(await profile(profileId), real),
    forget: async (profileId, path) => folders.forget(await profile(profileId), path),
  };
};

export { mainFolderMemory };
