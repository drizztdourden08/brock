/* @layer renderer-shell @kind logic */
import type { FactoryMap, Platform, PlatformFactory } from '@drizztdourden08/brock-core';
import { resolvePlatform, withPorts } from '@drizztdourden08/brock-core';
import { createElectronFactory } from './hosts/electron-factory';
import { createWebFactory } from './hosts/web-factory';
import { platformState } from './platform-state';

const factories = (): FactoryMap => ({
  electron: (): PlatformFactory => withPorts(createElectronFactory(), platformState.ports.electron ?? {}),
  web: (): PlatformFactory => withPorts(createWebFactory(), platformState.ports.web ?? {}),
});

const getPlatform = (): Platform => {
  platformState.platform ??= resolvePlatform(factories());
  return platformState.platform;
};

export { getPlatform };
