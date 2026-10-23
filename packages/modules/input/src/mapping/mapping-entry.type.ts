/* @layer core @kind types */
import type { PadFamily } from '../pad/controller-slot.type';

interface MappingEntry {
  guid: string;
  name: string;
  vid: number;
  pid: number;
  platform?: string;
  family?: PadFamily;
}

interface GuidIds {
  vid: number;
  pid: number;
}

export type { MappingEntry, GuidIds };
