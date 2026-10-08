/* @layer electron-main @kind logic */
import { is } from '@electron-toolkit/utils';
import { createProfileStore } from '@drizztdourden08/brock-core/storage';
import type { EmitToWindow, MainContext, MainLogLevel } from '../types/main-context.type';
import type { ContextInput } from './create-main-context.type';
import { handle } from '../ipc/handle';
import { on } from '../ipc/on';
import { emit } from '../ipc/emit';
import { createNodeFileStore } from '../files/node-file-store';
import { getLegacyPath } from '../paths/get-legacy-path';
import { getUserDataPath } from '../paths/get-user-data-path';
import { getMainWindow } from '../window/get-main-window';
import { createJobRegistry } from '../jobs/create-job-registry';
import { createDataDomains } from '../storage/create-data-domains';
import { servicesProxy } from '../services/services-proxy';
import { openRouter } from '../open/open-router';

const createMainContext = ({ product, flags, instance, profileHooks, dataDomains = [] }: ContextInput): MainContext => {
  const files = createNodeFileStore();
  const profiles = createProfileStore(files, profileHooks);
  const storage = createDataDomains(dataDomains, (dir) => getUserDataPath(dir));

  const emitToWindow: EmitToWindow = (channel, ...args) => {
    const win = getMainWindow();
    if (win) emit(win, channel, ...args);
  };

  const jobs = createJobRegistry((snapshot) => emitToWindow('job:update', snapshot));

  const log = (message: string, level: MainLogLevel = 'info'): void => {
    console[level](`[main] ${message}`);
    emitToWindow('log:entry', { channel: 'main', level, message });
  };

  return {
    product,
    isDev: is.dev,
    flags,
    instance,
    paths: { userData: getLegacyPath, data: getUserDataPath },
    files,
    profiles,
    storage,
    job: jobs.start,
    jobs,
    window: getMainWindow,
    handle,
    on,
    emit: emitToWindow,
    log,
    onOpen: openRouter.onOpen,
    services: servicesProxy,
  };
};

export { createMainContext };
