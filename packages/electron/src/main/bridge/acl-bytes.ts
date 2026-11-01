/* @layer electron-main @kind logic */
import type { SecurityBindings } from './bridge.type';
import { BRIDGE_ACL_HEADER_BYTES, BRIDGE_ACL_SIZE_OFFSET } from './bridge.constants';

const littleEndian = (bytes: Uint8Array, at: number): number => (bytes[at] ?? 0) | ((bytes[at + 1] ?? 0) << 8);

const copied = (value: unknown): Uint8Array => Uint8Array.from(value as ArrayLike<number>);

const aclBytes = (native: SecurityBindings, acl: unknown): Uint8Array => {
  const header = copied(native.decode(acl, 'uint8_t', BRIDGE_ACL_HEADER_BYTES));
  return copied(native.decode(acl, 'uint8_t', littleEndian(header, BRIDGE_ACL_SIZE_OFFSET)));
};

export { aclBytes, littleEndian };
