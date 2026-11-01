/* @layer electron-main @kind logic */
import { ok } from '@drizztdourden08/brock-core/result';
import type { Result } from '@drizztdourden08/brock-core/result';
import type { Win32Bindings } from './win32-api.type';
import { ERROR_FILE_NOT_FOUND, ERROR_SUCCESS, HKEY_CURRENT_USER, KEY_WRITE, REG_OPTION_NON_VOLATILE, REG_SZ } from './win32-api.constants';

const codeOf = (value: unknown): number => (typeof value === 'number' ? value : -1);

const failure = (call: string, code: number): { success: false; error: string } => ({ success: false, error: `${call} failed with code ${String(code)}` });

const stringData = (value: string): Buffer => Buffer.from(`${value}\0`, 'utf16le');

const openedKey = (bindings: Win32Bindings, subKey: string): Result<number> => {
  const handle = [0];
  const code = codeOf(bindings.createKey(HKEY_CURRENT_USER, subKey, 0, null, REG_OPTION_NON_VOLATILE, KEY_WRITE, null, handle, [0]));
  return code === ERROR_SUCCESS ? { success: true, value: handle[0] ?? 0 } : failure('RegCreateKeyExW', code);
};

const setString = (bindings: Win32Bindings, subKey: string, name: string | null, value: string): Result => {
  const opened = openedKey(bindings, subKey);
  if (!opened.success) return opened;
  try {
    const data = stringData(value);
    const code = codeOf(bindings.setValue(opened.value, name, 0, REG_SZ, data, data.length));
    return code === ERROR_SUCCESS ? ok() : failure('RegSetValueExW', code);
  } finally {
    bindings.closeKey(opened.value);
  }
};

const removalResult = (call: string, value: unknown): Result => {
  const code = codeOf(value);
  return code === ERROR_SUCCESS || code === ERROR_FILE_NOT_FOUND ? ok() : failure(call, code);
};

const deleteTree = (bindings: Win32Bindings, subKey: string): Result => removalResult('RegDeleteTreeW', bindings.deleteTree(HKEY_CURRENT_USER, subKey));

const deleteValue = (bindings: Win32Bindings, subKey: string, name: string): Result =>
  removalResult('RegDeleteKeyValueW', bindings.deleteValue(HKEY_CURRENT_USER, subKey, name));

export { setString, deleteTree, deleteValue };
