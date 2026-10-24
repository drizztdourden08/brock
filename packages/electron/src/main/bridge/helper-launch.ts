/* @layer electron-main @kind logic */
import { app } from 'electron';
import { join, resolve } from 'path';
import type { HelperLaunch } from './app-bridge.type';
import { BRIDGE_FILE_ENV, BRIDGE_HELPER_EXT, BRIDGE_HELPER_NAME, BRIDGE_HELPERS_DIR, BRIDGE_RUN_AS_NODE } from './bridge.constants';
import { appBridgeFile } from './app-bridge-file';
import { mainScriptDir } from '../bootstrap/main-script-dir';

const helperFile = (name: string): string => {
  if (!BRIDGE_HELPER_NAME.test(name)) throw new Error(`"${name}" is not a helper name: lower case letters, digits and dashes.`);
  const file = `${name}${BRIDGE_HELPER_EXT}`;
  return app.isPackaged ? join(process.resourcesPath, BRIDGE_HELPERS_DIR, file) : resolve(mainScriptDir(), '..', BRIDGE_HELPERS_DIR, file);
};

const helperLaunch = (name: string): HelperLaunch => {
  const discovery = appBridgeFile.current?.();
  return {
    command: process.execPath,
    args: [helperFile(name)],
    env: { [BRIDGE_RUN_AS_NODE]: '1', ...(discovery ? { [BRIDGE_FILE_ENV]: discovery } : {}) },
  };
};

export { helperLaunch };
