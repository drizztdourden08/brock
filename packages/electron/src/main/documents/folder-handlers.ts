/* @layer electron-main @kind logic */
import type { MainContext } from '../types/main-context.type';

const registerFolderHandlers = ({ handle, documents }: Pick<MainContext, 'handle' | 'documents'>): void => {
  handle('document:revokeFolder', (_event, path) => Promise.resolve(documents.revokeFolder(path)));
  handle('document:trash', (_event, path) => documents.trash(path));
  handle('document:reveal', (_event, path) => documents.reveal(path));
  handle('document:rename', (_event, from, to, options) => documents.rename(from, to, options));
  handle('document:copy', (_event, from, to, options) => documents.copy(from, to, options));
  handle('document:mkdir', (_event, path, options) => documents.mkdir(path, options));
  handle('document:rememberedFolders', (_event, profileId) => documents.rememberedFolders(profileId));
  handle('document:regrant', (_event, profileId, path) => documents.regrant(profileId, path));
  handle('document:forgetFolder', (_event, profileId, path) => documents.forgetFolder(profileId, path));
};

export { registerFolderHandlers };
