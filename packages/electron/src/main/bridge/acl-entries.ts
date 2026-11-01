/* @layer electron-main @kind logic */
import type { AclEntry, AclEntryKind, SecurityBindings } from './bridge.type';
import { aclBytes } from './acl-bytes';
import { littleEndian } from './little-endian';
import { BRIDGE_ACE_KINDS, BRIDGE_ACE_SID_OFFSET, BRIDGE_ACE_SIZE_OFFSET, BRIDGE_ACL_COUNT_OFFSET, BRIDGE_ACL_HEADER_BYTES } from './bridge.constants';
import { sidText } from './sid-text';

const kindOf = (ace: Uint8Array): AclEntryKind => {
  const kind = BRIDGE_ACE_KINDS[ace[0] ?? -1];
  return kind === 'allow' || kind === 'deny' ? kind : 'other';
};

const entryOf = (native: SecurityBindings, ace: Uint8Array): AclEntry => {
  const kind = kindOf(ace);
  return { kind, sid: kind === 'allow' ? sidText(native, Uint8Array.from(ace.subarray(BRIDGE_ACE_SID_OFFSET))) : '' };
};

const sliceAt = (bytes: Uint8Array, at: number): Uint8Array => {
  const size = littleEndian(bytes, at + BRIDGE_ACE_SIZE_OFFSET);
  if (size <= BRIDGE_ACE_SID_OFFSET || at + size > bytes.length) throw new Error('the access list is malformed');
  return bytes.subarray(at, at + size);
};

const aclEntries = (native: SecurityBindings, acl: unknown): AclEntry[] => {
  if (!acl) return [];
  const bytes = aclBytes(native, acl);
  const entries: AclEntry[] = [];
  let at = BRIDGE_ACL_HEADER_BYTES;
  for (let index = 0; index < littleEndian(bytes, BRIDGE_ACL_COUNT_OFFSET); index += 1) {
    const ace = sliceAt(bytes, at);
    entries.push(entryOf(native, ace));
    at += ace.length;
  }
  return entries;
};

export { aclEntries };
