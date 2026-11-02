/* @layer electron-main @kind logic */
import type { Result } from '@drizztdourden08/brock-core/result';
import { removalResult } from './removal-result';
import type { Win32Bindings } from './win32-api.type';
import { HKEY_CURRENT_USER } from './win32-api.constants';

const deleteTree = (bindings: Win32Bindings, subKey: string): Result => removalResult('RegDeleteTreeW', bindings.deleteTree(HKEY_CURRENT_USER, subKey));

export { deleteTree };
