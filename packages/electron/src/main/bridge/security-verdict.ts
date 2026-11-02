/* @layer electron-main @kind logic */
import type { AclEntry, FileSecurity } from './bridge.type';
import { BRIDGE_NOT_PRIVATE, BRIDGE_TRUSTED_SIDS } from './bridge.constants';

const isTrustedEntry = (entry: AclEntry, trusted: ReadonlySet<string>): boolean => entry.kind === 'deny' || (entry.kind === 'allow' && trusted.has(entry.sid));

const securityVerdict = (security: FileSecurity, userSid: string): string | null => {
  const trusted = new Set([userSid, ...BRIDGE_TRUSTED_SIDS]);
  const ownerIsTrusted = trusted.has(security.ownerSid);
  const listIsTrusted = security.entries.length > 0 && security.entries.every((entry) => isTrustedEntry(entry, trusted));
  return ownerIsTrusted && listIsTrusted ? null : BRIDGE_NOT_PRIVATE;
};

export { securityVerdict };
