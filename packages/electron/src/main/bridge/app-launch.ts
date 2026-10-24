/* @layer electron-main @kind logic */
import { app } from 'electron';
import { BACKGROUND_FLAG } from '@drizztdourden08/brock-core/automation';
import type { AppLaunch, AppLaunchOptions } from './app-launch.type';
import { appFolder } from './app-folder';
import { carriedLaunchArgs } from './carried-launch-args';

const appLaunch = ({ background = false }: AppLaunchOptions = {}): AppLaunch => ({
  command: process.execPath,
  args: [...(app.isPackaged ? [] : [appFolder()]), ...carriedLaunchArgs(process.argv.slice(1)), ...(background ? [BACKGROUND_FLAG] : [])],
  env: {},
});

export { appLaunch };
