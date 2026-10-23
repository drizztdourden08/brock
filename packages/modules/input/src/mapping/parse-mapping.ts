/* @layer core @kind logic */
import type { MappingEntry } from './mapping-entry.type';
import type { PadFamily } from '../pad/controller-slot.type';
import { FAMILY_OF_TYPE } from '../pad/pad-slots.constants';
import { decodeGuid } from './decode-guid';
import { NAME_TYPES, PLATFORM_PREFIX, VENDOR_TYPES } from './mapping-db.constants';

const familyOf = (vid: number, name: string): PadFamily | undefined => {
  const type = VENDOR_TYPES[vid] ?? NAME_TYPES.find(([pattern]) => pattern.test(name))?.[1];
  return type === undefined ? undefined : FAMILY_OF_TYPE[type];
};

const parseMapping = (line: string): MappingEntry | null => {
  const [guid = '', name = '', ...bindings] = line.trim().split(',');
  if (guid.length === 0 || name.length === 0 || bindings.length === 0) return null;
  const { vid, pid } = decodeGuid(guid);
  const platform = bindings.find((field) => field.startsWith(PLATFORM_PREFIX))?.slice(PLATFORM_PREFIX.length);
  const family = familyOf(vid, name);
  return {
    guid: guid.toLowerCase(),
    name,
    vid,
    pid,
    ...(platform ? { platform } : {}),
    ...(family ? { family } : {}),
  };
};

export { parseMapping };
