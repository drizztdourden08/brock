/* @layer electron-main @kind logic */
import { app } from 'electron';
import type { UpdaterCapabilities } from '../updater.type';
import type { UpdaterRuntime } from './updater-main.type';

const updaterCapabilities = ({ feed, manager }: Pick<UpdaterRuntime, 'feed' | 'manager'>): UpdaterCapabilities => {
  if (!feed) return { hasSource: false, canCheck: false, canInstall: false };
  const canSelfUpdate = manager() !== null;
  return {
    hasSource: true,
    canCheck: canSelfUpdate || app.isPackaged || feed.harness,
    canInstall: canSelfUpdate || feed.harness,
  };
};

export { updaterCapabilities };
