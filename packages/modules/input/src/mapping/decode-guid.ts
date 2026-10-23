/* @layer core @kind logic */
import type { GuidIds } from './mapping-entry.type';
import { GUID_HEX_LENGTH, GUID_PRODUCT_BYTE, GUID_SPACER_BYTES, GUID_VENDOR_BYTE, NO_IDS } from './mapping-db.constants';

const wordAt = (guid: string, byte: number): number => {
  const at = byte * 2;
  return Number.parseInt(guid.slice(at + 2, at + 4) + guid.slice(at, at + 2), 16);
};

const decodeGuid = (guid: string): GuidIds => {
  if (guid.length !== GUID_HEX_LENGTH || !/^[0-9a-f]+$/i.test(guid)) return NO_IDS;
  const vid = wordAt(guid, GUID_VENDOR_BYTE);
  const pid = wordAt(guid, GUID_PRODUCT_BYTE);
  const named = GUID_SPACER_BYTES.some((byte) => wordAt(guid, byte) !== 0);
  return named || vid === 0 || pid === 0 ? NO_IDS : { vid, pid };
};

export { decodeGuid };
