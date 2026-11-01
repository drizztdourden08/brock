/* @layer electron-main @kind logic */
import type { SecurityBindings } from './bridge.type';
import { littleEndian } from './little-endian';
import { BRIDGE_ACL_HEADER_BYTES, BRIDGE_ACL_SIZE_OFFSET } from './bridge.constants';

const copied = (value: unknown): Uint8Array => Uint8Array.from(value as ArrayLike<number>);

const aclBytes = (native: SecurityBindings, acl: unknown): Uint8Array => {
  const header = copied(native.decode(acl, 'uint8_t', BRIDGE_ACL_HEADER_BYTES));
  return copied(native.decode(acl, 'uint8_t', littleEndian(header, BRIDGE_ACL_SIZE_OFFSET)));
};

export { aclBytes };
