/* @layer electron-main @kind logic */
import type { Koffi } from './koffi.type';
import type { Win32Bindings } from './win32-api.type';
import {
  ADVAPI32_DLL, REG_CLOSE_KEY_SIGNATURE, REG_CREATE_KEY_SIGNATURE, REG_DELETE_TREE_SIGNATURE, REG_DELETE_VALUE_SIGNATURE,
  REG_SET_VALUE_SIGNATURE, SH_CHANGE_NOTIFY_SIGNATURE, SHELL32_DLL,
} from './win32-api.constants';

const bindWin32 = (koffi: Koffi): Win32Bindings => {
  const advapi32 = koffi.load(ADVAPI32_DLL);
  const shell32 = koffi.load(SHELL32_DLL);
  return {
    createKey: advapi32.func(REG_CREATE_KEY_SIGNATURE),
    setValue: advapi32.func(REG_SET_VALUE_SIGNATURE),
    closeKey: advapi32.func(REG_CLOSE_KEY_SIGNATURE),
    deleteTree: advapi32.func(REG_DELETE_TREE_SIGNATURE),
    deleteValue: advapi32.func(REG_DELETE_VALUE_SIGNATURE),
    changeNotify: shell32.func(SH_CHANGE_NOTIFY_SIGNATURE),
  };
};

export { bindWin32 };
