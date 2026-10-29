/* @layer electron-main @kind logic */
import { BRIDGE_SDDL_ACCESS_LIST, BRIDGE_SDDL_ALIASES, BRIDGE_SDDL_ENTRY, BRIDGE_SDDL_ENTRY_FIELDS, BRIDGE_TRUSTED_SIDS } from './bridge.constants';

const isTrustedEntry = (entry: string, trusted: ReadonlySet<string>): boolean => {
  const fields = entry.split(';');
  const [type, , , , , trustee = ''] = fields;
  return fields.length === BRIDGE_SDDL_ENTRY_FIELDS && (type === 'D' || (type === 'A' && trusted.has(trustee)));
};

const sddlIsPrivate = (sddl: string, userSid: string): boolean => {
  const list = BRIDGE_SDDL_ACCESS_LIST.exec(sddl)?.[1];
  if (!list) return false;
  const trusted = new Set([userSid, ...BRIDGE_TRUSTED_SIDS, ...BRIDGE_SDDL_ALIASES]);
  const entries = [...list.matchAll(BRIDGE_SDDL_ENTRY)].map((match) => match[1] ?? '');
  return entries.length > 0 && entries.every((entry) => isTrustedEntry(entry, trusted));
};

export { sddlIsPrivate };
