/* @layer electron-main @kind constants */
const HKEY_CURRENT_USER = -2_147_483_647;
const KEY_WRITE = 0x2_00_06;
const REG_OPTION_NON_VOLATILE = 0;
const REG_SZ = 1;
const ERROR_SUCCESS = 0;
const ERROR_FILE_NOT_FOUND = 2;
const SHCNE_ASSOCCHANGED = 0x08_00_00_00;
const SHCNF_FLUSH = 0x10_00;

const ADVAPI32_DLL = 'advapi32.dll';
const SHELL32_DLL = 'shell32.dll';

const REG_CREATE_KEY_SIGNATURE = 'long RegCreateKeyExW(intptr hKey, str16 subKey, uint32 reserved, str16 cls, uint32 options, uint32 access, void *security, _Out_ intptr *result, _Out_ uint32 *disposition)';
const REG_SET_VALUE_SIGNATURE = 'long RegSetValueExW(intptr hKey, str16 name, uint32 reserved, uint32 type, const void *data, uint32 size)';
const REG_CLOSE_KEY_SIGNATURE = 'long RegCloseKey(intptr hKey)';
const REG_DELETE_TREE_SIGNATURE = 'long RegDeleteTreeW(intptr hKey, str16 subKey)';
const REG_DELETE_VALUE_SIGNATURE = 'long RegDeleteKeyValueW(intptr hKey, str16 subKey, str16 name)';
const SH_CHANGE_NOTIFY_SIGNATURE = 'void SHChangeNotify(int32 event, uint32 flags, void *item1, void *item2)';

const KOFFI_MISSING = 'the native Windows binding (koffi) is not installed';

export {
  HKEY_CURRENT_USER, KEY_WRITE, REG_OPTION_NON_VOLATILE, REG_SZ, ERROR_SUCCESS, ERROR_FILE_NOT_FOUND, SHCNE_ASSOCCHANGED, SHCNF_FLUSH,
  ADVAPI32_DLL, SHELL32_DLL, REG_CREATE_KEY_SIGNATURE, REG_SET_VALUE_SIGNATURE, REG_CLOSE_KEY_SIGNATURE, REG_DELETE_TREE_SIGNATURE,
  REG_DELETE_VALUE_SIGNATURE, SH_CHANGE_NOTIFY_SIGNATURE, KOFFI_MISSING,
};
