/* @layer electron-main @kind logic */
import type { OsIntegrationProduct, RegistryRemoval } from './os-integration.type';
import type { Win32Api } from './win32-api.type';
import { win32Api } from './win32-api';
import { windowsRegistryRemovals } from './windows-registry-removals';

const removeOne = (api: Win32Api, removal: RegistryRemoval): void => {
  if (removal.name === null) api.deleteTree(removal.key);
  else api.deleteValue(removal.key, removal.name);
};

const unregisterOsIntegration = (product: OsIntegrationProduct): void => {
  if (process.platform !== 'win32') return;
  const removals = windowsRegistryRemovals(product);
  if (removals.length === 0) return;
  const api = win32Api();
  if (!api.success) return;
  for (const removal of removals) removeOne(api.value, removal);
  api.value.notifyShell();
};

export { unregisterOsIntegration };
