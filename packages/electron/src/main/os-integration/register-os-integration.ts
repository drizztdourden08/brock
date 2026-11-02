/* @layer electron-main @kind logic */
import { fail, ok } from '@drizztdourden08/brock-core/result';
import type { Result } from '@drizztdourden08/brock-core/result';
import type { OsIntegrationProduct } from './os-integration.type';
import { fileIconOf } from './file-icon-of';
import { win32Api } from './win32-api';
import { windowsRegistryEntries } from './windows-registry-entries';

const registerOsIntegration = (product: OsIntegrationProduct, exe: string = process.execPath): Result => {
  if (process.platform !== 'win32') return ok();
  const entries = windowsRegistryEntries(product, exe, fileIconOf(exe));
  if (entries.length === 0) return ok();
  const api = win32Api();
  if (!api.success) return fail(`registering ${product.name} with Windows failed: ${api.error}`);
  for (const entry of entries) {
    const written = api.value.setString(entry.key, entry.name, entry.value);
    if (!written.success) return fail(`registering ${product.name} with Windows failed at ${entry.key}: ${written.error}`);
  }
  api.value.notifyShell();
  return ok();
};

export { registerOsIntegration };
