/* @layer electron-main @kind barrel */
import '../augment';
import type { MainModule } from '@drizztdourden08/brock-electron/main';
import { createUpdaterMain } from './create-updater-main';

const updaterMain: MainModule = createUpdaterMain();

export default updaterMain;
export { updaterMain, createUpdaterMain };
export type { VelopackHook, VelopackHooks, UpdaterOptions, UpdaterMain } from './updater-main.type';
export type {
  UpdateInfo, VersionOption, UpdaterCapabilities, UpdaterPrefs, DownloadProgress,
} from '../updater.type';
