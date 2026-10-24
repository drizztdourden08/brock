/* @layer electron-main @kind logic */
import { app, shell } from 'electron';
import { join } from 'path';
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
import { mainFolderMemory } from '../documents/main-folder-memory';
import { mainRecent } from '../documents/main-recent';
import { getLegacyPath } from '../paths/get-legacy-path';
import { getUserDataPath } from '../paths/get-user-data-path';
import { createWindowControl } from '../window/create-window-control';
import { showMainWindow } from '../background/show-main-window';
import { createDialogs } from '../dialogs/create-dialogs';
import { createTrayControl } from '../tray/create-tray-control';
import { createJobRegistry } from '@drizztdourden08/brock-core/jobs';
import { createDataDomains } from '../storage/create-data-domains';
import { servicesProxy } from '../services/services-proxy';
import { openRouter } from '../open/open-router';
import { createAppBridge } from '../bridge/create-app-bridge';
import { bridgeFileName } from '../bridge/bridge-file-name';

const createMainContext = ({ product, flags, instance, profileHooks, dataDomains = [], icon, bridge }: ContextInput): MainContext => {
  const paths = { userData: getLegacyPath, data: getUserDataPath };
  const files = createNodeFileStore({ trashItem: (full) => shell.trashItem(full) });
  const profiles = createProfileStore(files, profileHooks);
  const storage = createDataDomains(dataDomains, (dir) => getUserDataPath(dir));

  const window = createWindowControl();

  const emitToWindow: EmitToWindow = (channel, ...args) => {
    const win = window();
    if (win) emit(win, channel, ...args);
  };

  const log = (message: string, level: MainLogLevel = 'info'): void => {
    console[level](`[main] ${message}`);
    emitToWindow('log:entry', { channel: 'main', level, message });
  };

  const documents: DocumentAccess = createDocumentAccess({
    protectedRoots: () => appOwnFolders(paths),
    recent: (profileId) => mainRecent({ paths, documents, files, log, profiles }, profileId),
    memory: () => mainFolderMemory({ paths, documents, log, profiles }),
    trashItem: (full) => shell.trashItem(full),
  });

  const jobs = createJobRegistry((snapshot) => emitToWindow('job:update', snapshot), Date.now, (jobId, line) => log(`[job ${jobId}] ${line.message}`, line.level));

  const bridgeFile = (): string => join(app.getPath('appData'), product.id, bridgeFileName(bridge?.key ?? null));
  const context: MainContext = {
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
    window,
    tray: createTrayControl({ productName: product.name, icon, show: showMainWindow, quit: () => app.quit(), log }),
    dialogs: createDialogs({ flags, window, log }),
    handle,
    on,
    emit: emitToWindow,
    ask,
    askWithin,
    log,
    onOpen: openRouter.onOpen,
    bridge: createAppBridge({ options: bridge?.options ?? null, file: bridgeFile, ctx: () => context }),
    services: servicesProxy,
  };
  return context;
};

export { createMainContext };
