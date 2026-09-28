/* @layer renderer-shell @kind barrel */
export { PlatformProvider } from './PlatformProvider';
export type { PlatformProviderProps } from './PlatformProvider';
export { PlatformContext } from './platform-context';
export { usePlatform } from './usePlatform';
export { useCapability } from './useCapability';
export { getPlatform } from './get-platform';
export { setPlatformPorts } from './set-platform-ports';
export { installApiShim } from './api-shim';
export type { ApiShimMaps, ApiShimOptions } from './api-shim.type';
export { createElectronFactory } from './hosts/electron-factory';
export { createWebFactory } from './hosts/web-factory';
export type { ModulePorts } from './platform.type';
