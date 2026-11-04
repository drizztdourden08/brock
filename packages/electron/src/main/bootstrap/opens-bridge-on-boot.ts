/* @layer electron-main @kind logic */
import type { AppBridgeOptions } from '../bridge/app-bridge.type';

const opensBridgeOnBoot = (app: AppBridgeOptions | undefined, extensionsAsk: boolean): boolean => {
  if (app?.openOnBoot === false) return false;
  return app !== undefined || extensionsAsk;
};

export { opensBridgeOnBoot };
