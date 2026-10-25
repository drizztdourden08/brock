/* @layer renderer-shell @kind types */
import type { MappingEntry } from '../../../mapping/mapping-entry.type';

interface MappingList {
  entries: readonly MappingEntry[];
  loaded: boolean;
}

export type { MappingList };
