/* @layer electron-main @kind logic */
import { spawnSync } from 'child_process';
import { fail, ok } from '@drizztdourden08/brock-core/result';
import type { Result } from '@drizztdourden08/brock-core/result';
import type { OsIntegrationProduct } from './os-integration.type';
import { fileIconOf } from './file-icon-of';
import { notifyShell } from './notify-shell';
import { regArgs } from './reg-args';
import { windowsRegistryEntries } from './windows-registry-entries';

const registerOsIntegration = (product: OsIntegrationProduct, exe: string = process.execPath): Result => {
  if (process.platform !== 'win32') return ok();
  const entries = windowsRegistryEntries(product, exe, fileIconOf(exe));
  if (entries.length === 0) return ok();
  for (const entry of entries) {
    const { status, error } = spawnSync('reg', regArgs(entry), { windowsHide: true, stdio: 'ignore' });
    if (status !== 0) return fail(`registering ${product.name} with Windows failed at ${entry.key}: ${error?.message ?? `reg exited ${String(status)}`}`);
  }
  notifyShell();
  return ok();
};

export { registerOsIntegration };
