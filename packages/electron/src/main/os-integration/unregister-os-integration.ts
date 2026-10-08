/* @layer electron-main @kind logic */
import { spawnSync } from 'child_process';
import type { OsIntegrationProduct } from './os-integration.type';
import { notifyShell } from './notify-shell';
import { regArgs } from './reg-args';
import { windowsRegistryRemovals } from './windows-registry-removals';

const unregisterOsIntegration = (product: OsIntegrationProduct): void => {
  if (process.platform !== 'win32') return;
  const removals = windowsRegistryRemovals(product);
  if (removals.length === 0) return;
  for (const removal of removals) spawnSync('reg', regArgs(removal), { windowsHide: true, stdio: 'ignore' });
  notifyShell();
};

export { unregisterOsIntegration };
