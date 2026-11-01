/* @layer electron-main @kind logic */
import type { FileSecurityReader } from './bridge.type';
import { ERROR_SUCCESS } from '../os-integration/win32-api.constants';
import { aclEntries } from './acl-entries';
import { BRIDGE_SE_FILE_OBJECT, BRIDGE_SECURITY_QUERY } from './bridge.constants';
import { securityBindings } from './security-bindings';
import { sidText } from './sid-text';

const readFileSecurity: FileSecurityReader = (file) => {
  const native = securityBindings();
  const owner: unknown[] = [null];
  const dacl: unknown[] = [null];
  const descriptor: unknown[] = [null];
  const code = native.getSecurity(file, BRIDGE_SE_FILE_OBJECT, BRIDGE_SECURITY_QUERY, owner, null, dacl, null, descriptor);
  try {
    if (code !== ERROR_SUCCESS) throw new Error(`GetNamedSecurityInfoW failed with code ${String(code)}`);
    return { ownerSid: sidText(native, owner[0]), entries: aclEntries(native, dacl[0]) };
  } finally {
    if (descriptor[0]) native.free(descriptor[0]);
  }
};

export { readFileSecurity };
