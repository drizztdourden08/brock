/* @layer electron-main @kind logic */
import { fail, ok } from '@drizztdourden08/brock-core/result';
import type { Result } from '@drizztdourden08/brock-core/result';
import type { Win32Api, Win32Bindings } from './win32-api.type';
import { KOFFI_MISSING, SHCNE_ASSOCCHANGED, SHCNF_FLUSH } from './win32-api.constants';
import { loadKoffi } from './load-koffi';
import { bindWin32 } from './win32-bindings';
import { deleteTree } from './delete-tree';
import { deleteValue } from './delete-value';
import { setString } from './win32-registry-calls';

const messageOf = (error: unknown): string => (error instanceof Error ? error.message : String(error));

const guarded = (call: () => Result): Result => {
  try {
    return call();
  } catch (error) {
    return fail(messageOf(error));
  }
};

const notifyShell = (bindings: Win32Bindings): Result => {
  bindings.changeNotify(SHCNE_ASSOCCHANGED, SHCNF_FLUSH, null, null);
  return ok();
};

const apiOf = (bindings: Win32Bindings): Win32Api => ({
  setString: (subKey, name, value) => guarded(() => setString(bindings, subKey, name, value)),
  deleteTree: (subKey) => guarded(() => deleteTree(bindings, subKey)),
  deleteValue: (subKey, name) => guarded(() => deleteValue(bindings, subKey, name)),
  notifyShell: () => guarded(() => notifyShell(bindings)),
});

const win32Api = (): Result<Win32Api> => {
  const koffi = loadKoffi();
  if (!koffi) return { success: false, error: KOFFI_MISSING };
  try {
    return { success: true, value: apiOf(bindWin32(koffi)) };
  } catch (error) {
    return { success: false, error: `the native Windows binding could not be loaded: ${messageOf(error)}` };
  }
};

export { win32Api };
