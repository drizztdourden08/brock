/* @layer electron-main @kind logic */
import { protocol } from 'electron';
import type { PrivilegedScheme } from '@drizztdourden08/brock-core/product';

const registerPrivilegedSchemes = (schemes: readonly PrivilegedScheme[]): void => {
  const seen = new Set<string>();
  const unique = schemes.filter(({ scheme }) => {
    if (seen.has(scheme)) return false;
    seen.add(scheme);
    return true;
  });
  if (unique.length === 0) return;
  protocol.registerSchemesAsPrivileged(unique.map(({ scheme, stream }) => ({
    scheme,
    privileges: { standard: true, secure: true, supportFetchAPI: true, stream: stream ?? false },
  })));
};

export { registerPrivilegedSchemes };
