/* @layer electron-main @kind logic */
import { app } from 'electron';
import type { UpdaterRuntime } from './updater-main.type';

const currentVersion = ({ manager }: Pick<UpdaterRuntime, 'manager'>): string =>
  manager()?.getCurrentVersion() ?? app.getVersion();

export { currentVersion };
