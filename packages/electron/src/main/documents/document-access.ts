/* @layer electron-main @kind logic */
import { realpathSync } from 'fs';
import { absolutePath } from './absolute-path';
import type { DocumentAccess, DocumentAccessDeps } from './document-access.type';
import { createFolderGrants } from './folder-grants';
import { listFolder } from './list-folder';
import { LIST_LIMITS } from './list-limits.constants';
import { createListGate } from './list-gate';
import { listOptions } from './list-options';
import { fsWatcher } from './fs-watcher';
import { makeFolder } from './make-folder';
import { pathKey as keyOf } from './path-key';
import { regrantFolder } from './regrant-folder';
import { renameItem } from './rename-item';
import { trashItem } from './trash-item';
import type { RememberedFolders } from './remembered-folders.type';
import { WATCH_DEBOUNCE_MS } from './watch-limits.constants';
import { createWatchRegistry } from './watch-registry';
import { watchGranted } from './watch-granted';

const createDocumentAccess = (deps: DocumentAccessDeps = {}): DocumentAccess => {
  const allowed = new Map<string, string>();
  const registry = createWatchRegistry();
  const folders = createFolderGrants({ protectedRoots: deps.protectedRoots, sensitiveRoots: deps.sensitiveRoots, onRevoke: registry.stopRoot });
  const limits = { ...LIST_LIMITS, ...deps.limits };
  const memory = (): RememberedFolders => {
    if (deps.memory === undefined) throw new Error('Remembered folders are not available here');
    return deps.memory();
  };
  const trash = deps.trashItem ?? ((): Promise<void> => Promise.reject(new Error('The trash is not available here')));
  const oneListing = createListGate(limits.waiting);

  const allow = (path: string): string => {
    const full = absolutePath(path);
    allowed.set(keyOf(full), full);
    return full;
  };

  const resolve = async (path: string, intent: 'read' | 'write' = 'read'): Promise<string> => {
    const full = absolutePath(path);
    const granted = allowed.get(keyOf(full)) ?? (await folders.contain(path, intent === 'write'));
    if (granted === null) throw new Error(`The renderer may not use "${full}": pick it in a document dialog first`);
    return granted;
  };

  return {
    allow,
    allowFolder: folders.allow,
    revokeFolder: folders.revoke,
    folderRefusal: (path) => {
      try {
        folders.vet(path);
        return null;
      } catch (error) {
        return error instanceof Error ? error.message : String(error);
      }
    },
    exact: (path) => allowed.has(keyOf(absolutePath(path))),
    isAllowed: (path) => resolve(path).then(() => true, () => false),
    resolve,
    list: (folder, options) => oneListing(async () => {
      const settings = listOptions(options);
      const real = await folders.contain(folder);
      const root = real === null ? null : folders.rootOf(real);
      if (real === null || root === null) throw new Error(`"${absolutePath(folder)}" is not inside a granted folder`);
      return listFolder(real, settings, limits, { covers: folders.covers, live: () => folders.holds(root) });
    }),
    recent: (profileId) => deps.recent?.(profileId) ?? Promise.resolve([]),
    trash: (path) => trashItem(folders, trash, path),
    rename: (from, to, options) => renameItem(folders, from, to, options),
    mkdir: (path, options) => makeFolder(folders, path, options),
    watch: (folder, options, listener) => watchGranted({ folders, registry, watcher: deps.watcher ?? fsWatcher, ms: deps.watchMs ?? WATCH_DEBOUNCE_MS, max: limits.entries }, folder, options, listener),
    rememberFolder: async (profileId, path) => {
      const real = realpathSync.native(absolutePath(path));
      if (!folders.holds(real)) throw new Error(`"${real}" is not a granted folder`);
      await memory().remember(profileId, real);
    },
    rememberedFolders: (profileId) => memory().list(profileId),
    regrant: (profileId, path) => regrantFolder(folders, memory(), profileId, path),
    forgetFolder: async (profileId, path) => memory().forget(profileId, absolutePath(path)),
  };
};

export { createDocumentAccess };
