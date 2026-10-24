/* @layer electron-main @kind logic */
import { shell } from 'electron';
import { is } from '@electron-toolkit/utils';
import { createProfileStore } from '@drizztdourden08/brock-core/storage';
import type { EmitToWindow, MainContext, MainLogLevel } from '../types/main-context.type';
import type { ContextInput } from './create-main-context.type';
import { handle } from '../ipc/handle';
import { on } from '../ipc/on';
import { emit } from '../ipc/emit';
import { ask } from '../ipc/ask';
import { askWithin } from '../ipc/ask-within';
import { createNodeFileStore } from '../files/node-file-store';
import { createDocumentAccess } from '../documents/document-access';
import type { DocumentAccess } from '../documents/document-access.type';
import { appOwnFolders } from '../documents/app-own-folders';
import { mainRecent } from '../documents/main-recent';
import { getLegacyPath } from '../paths/get-legacy-path';
import { getUserDataPath } from '../paths/get-user-data-path';
import { getMainWindow } from '../window/get-main-window';
import { createJobRegistry } from '@drizztdourden08/brock-core/jobs';
import { createDataDomains } from '../storage/create-data-domains';
import { servicesProxy } from '../services/services-proxy';
import { openRouter } from '../open/open-router';

const createMainContext = ({ product, flags, instance, profileHooks, dataDomains = [] }: ContextInput): MainContext => {
  const paths = { userData: getLegacyPath, data: getUserDataPath };
  const files = createNodeFileStore({ trashItem: (full) => shell.trashItem(full) });
  const profiles = createProfileStore(files, profileHooks);
  const storage = createDataDomains(dataDomains, (dir) => getUserDataPath(dir));

  const emitToWindow: EmitToWindow = (channel, ...args) => {
    const win = getMainWindow();
    if (win) emit(win, channel, ...args);
  };

  const log = (message: string, level: MainLogLevel = 'info'): void => {
    console[level](`[main] ${message}`);
    emitToWindow('log:entry', { channel: 'main', level, message });
  };

  const documents: DocumentAccess = createDocumentAccess({ protectedRoots: () => appOwnFolders(paths), recent: (profileId) => mainRecent({ paths, documents, files, log, profiles }, profileId) });

  const jobs = createJobRegistry((snapshot) => emitToWindow('job:update', snapshot), Date.now, (jobId, line) => log(`[job ${jobId}] ${line.message}`, line.level));

  return {
    product,
    isDev: is.dev,
    flags,
    instance,
    paths,
    files,
    documents,
    profiles,
    storage,
    job: jobs.start,
    jobs,
    window: getMainWindow,
    handle,
    on,
    emit: emitToWindow,
    ask,
    askWithin,
    log,
    onOpen: openRouter.onOpen,
    services: servicesProxy,
  };
};

export { createMainContext };
