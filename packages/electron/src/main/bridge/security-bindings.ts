/* @layer electron-main @kind logic */
import type { SecurityBindings } from './bridge.type';
import { ADVAPI32_DLL, KOFFI_MISSING } from '../os-integration/win32-api.constants';
import { loadKoffi } from '../os-integration/load-koffi';
import { BRIDGE_CONVERT_SID_SIGNATURE, BRIDGE_GET_SECURITY_SIGNATURE, BRIDGE_KERNEL32_DLL, BRIDGE_LOCAL_FREE_SIGNATURE } from './bridge.constants';

const remembered: { bindings?: SecurityBindings } = {};

const bound = (): SecurityBindings => {
  const koffi = loadKoffi();
  if (!koffi) throw new Error(KOFFI_MISSING);
  const advapi32 = koffi.load(ADVAPI32_DLL);
  return {
    getSecurity: advapi32.func(BRIDGE_GET_SECURITY_SIGNATURE),
    convertSid: advapi32.func(BRIDGE_CONVERT_SID_SIGNATURE),
    free: koffi.load(BRIDGE_KERNEL32_DLL).func(BRIDGE_LOCAL_FREE_SIGNATURE),
    decode: koffi.decode,
  };
};

const securityBindings = (): SecurityBindings => {
  remembered.bindings ??= bound();
  return remembered.bindings;
};

export { securityBindings };
