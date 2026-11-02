/* @layer electron-main @kind logic */
import type { Result } from '@drizztdourden08/brock-core/result';
import { removalResult } from './removal-result';
import type { Win32Bindings } from './win32-api.type';
import { HKEY_CURRENT_USER } from './win32-api.constants';

const deleteValue = (bindings: Win32Bindings, subKey: string, name: string): Result =>
  removalResult('RegDeleteKeyValueW', bindings.deleteValue(HKEY_CURRENT_USER, subKey, name));

export { deleteValue };
