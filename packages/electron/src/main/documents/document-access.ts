/* @layer electron-main @kind logic */
import { absolutePath } from './absolute-path';
import type { DocumentAccess, DocumentAccessDeps } from './document-access.type';
import { createFolderGrants } from './folder-grants';
import { listFolder } from './list-folder';
import { listOptions } from './list-options';
import { pathKey as keyOf } from './path-key';

const createDocumentAccess = (deps: DocumentAccessDeps = {}): DocumentAccess => {
  const allowed = new Map<string, string>();
  const folders = createFolderGrants();

  const allow = (path: string): string => {
    const full = absolutePath(path);
    allowed.set(keyOf(full), full);
    return full;
  };

  const resolve = async (path: string): Promise<string> => {
    const full = absolutePath(path);
    const granted = allowed.get(keyOf(full)) ?? (await folders.contain(path));
    if (granted === null) throw new Error(`The renderer may not use "${full}": pick it in a document dialog first`);
    return granted;
  };

  return {
    allow,
    allowFolder: folders.allow,
    revokeFolder: folders.revoke,
    isAllowed: (path) => resolve(path).then(() => true, () => false),
    resolve,
    list: async (folder, options) => {
      const settings = listOptions(options);
      const real = await folders.contain(folder);
      if (real === null) throw new Error(`"${absolutePath(folder)}" is not inside a granted folder`);
      return listFolder(real, settings, folders.covers);
    },
    recent: (profileId) => deps.recent?.(profileId) ?? Promise.resolve([]),
  };
};

export { createDocumentAccess };
