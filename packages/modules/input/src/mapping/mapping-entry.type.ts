/* @layer core @kind types */
import type { PadFamily } from '../pad/controller-slot.type';

type MappingSource = 'builtin' | 'bundled' | 'user';

interface MappingEntry {
  guid: string;
  name: string;
  vid: number;
  pid: number;
  platform?: string;
  family?: PadFamily;
  source: MappingSource;
  mapping: string;
  inputCount: number;
}

interface GuidIds {
  vid: number;
  pid: number;
}

export type { MappingEntry, MappingSource, GuidIds };
